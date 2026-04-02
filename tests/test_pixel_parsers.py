#!/usr/bin/env python3
"""
Unit tests for pixel-only model action parsers.

Tests MAI-UI, UI-TARS, and Holo2 parsers for:
- Correct action extraction
- Coordinate mapping accuracy
- Rejection of false positives from reasoning text
- Edge cases (missing fields, malformed JSON, etc.)

Usage:
    python scripts/test_pixel_parsers.py
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

import json
import unittest


class TestMAIUIParser(unittest.TestCase):
    """Tests for MAI-UI-8B action parsing."""

    def setUp(self):
        from agents.mai_ui_agent import parse_mai_ui_action, mai_action_to_browsergym
        self.parse = parse_mai_ui_action
        self.to_bg = mai_action_to_browsergym

    def test_click_basic(self):
        raw = '<action>{"action":"click","coordinate":[530,410]}</action>'
        d = self.parse(raw)
        self.assertIsNotNone(d)
        bg = self.to_bg(d)
        self.assertIsNotNone(bg)
        # 530/999*1000 = 530.53 -> 531, 410/999*1000 = 410.41 -> 410
        self.assertIn("mouse_click(", bg)
        self.assertIn("531", bg)
        self.assertIn("410", bg)

    def test_click_with_thinking(self):
        raw = (
            '<think>I see a button around (530, 410) area. '
            'Let me click coordinates(530, 410) to proceed.</think>\n'
            '<action>{"action":"click","coordinate":[530,410]}</action>'
        )
        d = self.parse(raw)
        self.assertIsNotNone(d)
        bg = self.to_bg(d)
        self.assertIn("mouse_click(", bg)

    def test_type_action(self):
        raw = '<action>{"action":"type","text":"Hello world"}</action>'
        d = self.parse(raw)
        bg = self.to_bg(d)
        self.assertEqual(bg, "keyboard_type('Hello world')")

    def test_scroll_down(self):
        raw = '<action>{"action":"scroll","coordinate":[500,500],"direction":"down"}</action>'
        d = self.parse(raw)
        bg = self.to_bg(d)
        self.assertIn("scroll(", bg)
        self.assertIn("3", bg)  # positive delta = down

    def test_scroll_up(self):
        raw = '<action>{"action":"scroll","coordinate":[500,500],"direction":"up"}</action>'
        d = self.parse(raw)
        bg = self.to_bg(d)
        self.assertIn("scroll(", bg)
        self.assertIn("-3", bg)

    def test_drag(self):
        raw = '<action>{"action":"drag","startCoordinate":[100,200],"endCoordinate":[800,600]}</action>'
        d = self.parse(raw)
        bg = self.to_bg(d)
        self.assertIn("mouse_drag_and_drop(", bg)

    def test_key_press(self):
        raw = '<action>{"action":"key_press","key":"Enter"}</action>'
        d = self.parse(raw)
        bg = self.to_bg(d)
        self.assertEqual(bg, "keyboard_press('Enter')")

    def test_done_message(self):
        raw = '<action>{"action":"type","text":"DONE: The answer is 42"}</action>'
        d = self.parse(raw)
        bg = self.to_bg(d)
        self.assertIn("send_msg_to_user(", bg)
        self.assertIn("The answer is 42", bg)

    def test_no_action_tag(self):
        raw = "I think we should click at (530, 410) to proceed."
        d = self.parse(raw)
        self.assertIsNone(d)

    def test_malformed_json(self):
        raw = "<action>{bad json}</action>"
        d = self.parse(raw)
        self.assertIsNone(d)

    def test_negative_reasoning_coords_not_parsed(self):
        """Reasoning text with coord-like patterns must NOT be parsed as actions."""
        raw = (
            'I need to click around(530, 410) and also consider coordinates(100, 200). '
            'The element at position approximately(300, 400) looks relevant.'
        )
        d = self.parse(raw)
        self.assertIsNone(d)

    def test_coord_999_maps_to_1000(self):
        raw = '<action>{"action":"click","coordinate":[999,999]}</action>'
        d = self.parse(raw)
        bg = self.to_bg(d)
        self.assertIn("mouse_click(1000, 1000)", bg)

    def test_coord_0_maps_to_0(self):
        raw = '<action>{"action":"click","coordinate":[0,0]}</action>'
        d = self.parse(raw)
        bg = self.to_bg(d)
        self.assertIn("mouse_click(0, 0)", bg)


class TestUITarsParser(unittest.TestCase):
    """Tests for UI-TARS-1.5-7B action parsing."""

    def setUp(self):
        from agents.ui_tars_agent import (
            _extract_last_action_line,
            parse_ui_tars_action,
            _map_coords_to_browsergym,
        )
        from agents.pixel_vlm_base import smart_resize
        self.extract_action = _extract_last_action_line
        self.parse_action = parse_ui_tars_action
        self.map_coords = _map_coords_to_browsergym
        self.smart_resize = smart_resize

    def test_extract_last_action(self):
        raw = (
            "Thought: I see a button\n"
            "Action: click(point='<point>197 525</point>')"
        )
        line = self.extract_action(raw)
        self.assertIsNotNone(line)
        self.assertIn("click", line)
        self.assertIn("197", line)
        self.assertIn("525", line)

    def test_extract_last_of_multiple_actions(self):
        raw = (
            "Thought: First attempt\n"
            "Action: click(point='<point>100 100</point>')\n"
            "Thought: Actually, let me correct\n"
            "Action: click(point='<point>200 300</point>')"
        )
        line = self.extract_action(raw)
        self.assertIn("200", line)
        self.assertIn("300", line)

    def test_coord_mapping(self):
        # Simple case: model predicts in 1400x700 resized image
        # Point (700, 350) = center of resized image
        bx, by = self.map_coords(700, 350, 1920, 1080, 1400, 700)
        # 700/1400*1920 = 960 -> 960/1920*1000 = 500
        # 350/700*1080 = 540 -> 540/1080*1000 = 500
        self.assertEqual(bx, 500)
        self.assertEqual(by, 500)

    def test_smart_resize(self):
        h, w = self.smart_resize(1080, 1920)
        self.assertEqual(h % 28, 0)
        self.assertEqual(w % 28, 0)
        total = h * w
        self.assertGreaterEqual(total, 100 * 28 * 28)
        self.assertLessEqual(total, 16384 * 28 * 28)

    def test_parse_click_with_point_tags(self):
        action_line = "click(point='<point>197 525</point>')"
        bg = self.parse_action(action_line, 1920, 1080, 1400, 700)
        self.assertIsNotNone(bg)
        self.assertIn("mouse_click(", bg)

    def test_parse_click_with_parens(self):
        action_line = "click(start_box='(197,525)')"
        bg = self.parse_action(action_line, 1920, 1080, 1400, 700)
        self.assertIsNotNone(bg)
        self.assertIn("mouse_click(", bg)

    def test_parse_type(self):
        action_line = "type(content='Hello world')"
        bg = self.parse_action(action_line, 1920, 1080, 1400, 700)
        self.assertEqual(bg, "keyboard_type('Hello world')")

    def test_parse_scroll(self):
        action_line = "scroll(point='<point>500 400</point>', direction='down')"
        bg = self.parse_action(action_line, 1920, 1080, 1400, 700)
        self.assertIn("scroll(", bg)

    def test_parse_hotkey(self):
        action_line = "hotkey(key='ctrl c')"
        bg = self.parse_action(action_line, 1920, 1080, 1400, 700)
        self.assertIn("keyboard_press(", bg)
        self.assertIn("Ctrl+c", bg)

    def test_parse_drag(self):
        action_line = "drag(start_point='<point>100 200</point>', end_point='<point>800 600</point>')"
        bg = self.parse_action(action_line, 1920, 1080, 1400, 700)
        self.assertIn("mouse_drag_and_drop(", bg)

    def test_parse_finished(self):
        action_line = "finished(content='The answer is 42')"
        bg = self.parse_action(action_line, 1920, 1080, 1400, 700)
        self.assertIn("send_msg_to_user(", bg)
        self.assertIn("The answer is 42", bg)

    def test_parse_wait(self):
        action_line = "wait()"
        bg = self.parse_action(action_line, 1920, 1080, 1400, 700)
        self.assertEqual(bg, "noop(5000)")


class TestHolo2Parser(unittest.TestCase):
    """Tests for Holo2-30B-A3B action parsing."""

    def setUp(self):
        from agents.holo2_agent import holo2_json_to_browsergym, _try_parse_json_from_text
        self.to_bg = holo2_json_to_browsergym
        self.parse_json = _try_parse_json_from_text

    def test_click_basic(self):
        data = {"action_type": "click", "coordinate": [500, 500]}
        bg = self.to_bg(data)
        self.assertEqual(bg, "mouse_click(500, 500)")

    def test_double_click(self):
        data = {"action_type": "double_click", "coordinate": [300, 200]}
        bg = self.to_bg(data)
        self.assertEqual(bg, "mouse_dblclick(300, 200)")

    def test_type(self):
        data = {"action_type": "type", "text": "Hello world"}
        bg = self.to_bg(data)
        self.assertEqual(bg, "keyboard_type('Hello world')")

    def test_scroll(self):
        data = {"action_type": "scroll", "coordinate": [500, 500], "direction": "down"}
        bg = self.to_bg(data)
        self.assertIn("scroll(500, 500, 0, 3)", bg)

    def test_drag(self):
        data = {"action_type": "drag", "coordinate": [100, 200], "end_coordinate": [800, 600]}
        bg = self.to_bg(data)
        self.assertEqual(bg, "mouse_drag_and_drop(100, 200, 800, 600)")

    def test_key_press(self):
        data = {"action_type": "key_press", "key": "Enter"}
        bg = self.to_bg(data)
        self.assertEqual(bg, "keyboard_press('Enter')")

    def test_noop(self):
        data = {"action_type": "noop"}
        bg = self.to_bg(data)
        self.assertEqual(bg, "noop(1000)")

    def test_send_answer(self):
        data = {"action_type": "send_answer", "text": "42"}
        bg = self.to_bg(data)
        self.assertIn("send_msg_to_user(", bg)
        self.assertIn("42", bg)

    def test_parse_json_from_code_fence(self):
        raw = '```json\n{"action_type": "click", "coordinate": [500, 300]}\n```'
        d = self.parse_json(raw)
        self.assertIsNotNone(d)
        self.assertEqual(d["action_type"], "click")

    def test_parse_json_from_raw(self):
        raw = '{"action_type": "click", "coordinate": [500, 300]}'
        d = self.parse_json(raw)
        self.assertIsNotNone(d)

    def test_parse_json_from_text_with_reasoning(self):
        raw = (
            'I see a button in the center. Let me click it.\n'
            '{"action_type": "click", "coordinate": [500, 300]}'
        )
        d = self.parse_json(raw)
        self.assertIsNotNone(d)
        self.assertEqual(d["action_type"], "click")

    def test_parse_no_json(self):
        raw = "I think we should click the button at position (500, 300)"
        d = self.parse_json(raw)
        self.assertIsNone(d)

    def test_missing_coordinate(self):
        data = {"action_type": "click"}
        bg = self.to_bg(data)
        self.assertIsNone(bg)

    def test_unknown_action(self):
        data = {"action_type": "teleport", "coordinate": [100, 200]}
        bg = self.to_bg(data)
        self.assertIsNone(bg)


class TestNegativeCases(unittest.TestCase):
    """Cross-parser negative tests: reasoning text must never be parsed as actions."""

    def test_mai_ui_ignores_reasoning_coordinates(self):
        from agents.mai_ui_agent import parse_mai_ui_action
        raw = (
            '<grounding_think>The button is around (530, 410). '
            'I should click coordinates(530, 410) to proceed.</grounding_think>\n'
            'No action tag here, just reasoning text with around(530, 410).'
        )
        d = parse_mai_ui_action(raw)
        self.assertIsNone(d)

    def test_ui_tars_only_parses_action_line(self):
        from agents.ui_tars_agent import _extract_last_action_line
        raw = (
            'Thought: I should click around (530, 410). coordinates(530, 410) looks right.\n'
            'The element at approximately(300, 400) is the target.\n'
            'There is no action line here, only reasoning text.'
        )
        line = _extract_last_action_line(raw)
        self.assertIsNone(line)

    def test_holo2_ignores_non_json(self):
        from agents.holo2_agent import _try_parse_json_from_text
        raw = (
            'I need to click around(530, 410) and coordinates(100, 200). '
            'Let me try approximately(300, 400).'
        )
        d = _try_parse_json_from_text(raw)
        self.assertIsNone(d)


if __name__ == "__main__":
    unittest.main(verbosity=2)
