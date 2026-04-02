#!/usr/bin/env python3
"""
Regression tests for action parsing in OpenRouterAgent.

This script tests the _extract_thinking_and_action() function to ensure it:
1. Correctly parses actions from post-</think> region when think tags exist
2. Takes the LAST valid action (not first) to avoid reasoning text patterns
3. Never interprets "around(...)" or "coordinates(...)" from reasoning as actions

Usage:
    python scripts/test_action_parsing.py
"""
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from agents.openrouter_agent import (
    _extract_thinking_and_action,
    _try_parse_single_action,
    _transform_normalized_to_pixel,
    _find_last_valid_action,
    VALID_COORD_ACTIONS,
    VALID_BID_ACTIONS,
)


def test_think_tags_with_fake_action_in_reasoning():
    """Test that fake action patterns in <think> tags are ignored."""
    raw = """<think>
I can see a button in the center of the screen. The button appears to be around (530, 410) based on the grid overlay. I should click on it to proceed.
</think>

mouse_click(530, 410)"""
    
    thinking, action = _extract_thinking_and_action(raw, "coord")
    
    assert action == "mouse_click(530, 410)", f"Expected mouse_click(530, 410), got {action}"
    assert "around (530, 410)" in thinking, f"Thinking should contain reasoning text"
    print("✓ test_think_tags_with_fake_action_in_reasoning passed")


def test_think_tags_bid_mode():
    """Test that bid mode actions are correctly parsed from think tags."""
    raw = """<think>
I need to click on the button. The coordinates(10,20) in the description suggest it's at that position. Let me use the element ID instead.
</think>

click('a123')"""
    
    thinking, action = _extract_thinking_and_action(raw, "bid")
    
    assert action == "click('a123')", f"Expected click('a123'), got {action}"
    assert "coordinates(10,20)" in thinking, f"Thinking should contain reasoning text"
    print("✓ test_think_tags_bid_mode passed")


def test_no_think_tags_last_valid_action():
    """Test that without think tags, the LAST valid action is taken."""
    raw = """I should click around (530, 410) to interact with the button.
The element appears to be centered approximately(500, 500) in the viewport.
Let me execute the click action now.

mouse_click(530, 410)"""
    
    thinking, action = _extract_thinking_and_action(raw, "coord")
    
    # Should get mouse_click, not around or approximately
    assert action == "mouse_click(530, 410)", f"Expected mouse_click(530, 410), got {action}"
    print("✓ test_no_think_tags_last_valid_action passed")


def test_multiple_valid_actions_takes_last():
    """Test that when multiple valid actions exist, the last one is taken."""
    raw = """First I'll noop to wait: noop(500)
Then I'll click: mouse_click(300, 400)"""
    
    thinking, action = _extract_thinking_and_action(raw, "coord")
    
    # Should get the last action
    assert action == "mouse_click(300, 400)", f"Expected mouse_click(300, 400), got {action}"
    print("✓ test_multiple_valid_actions_takes_last passed")


def test_exact_single_action():
    """Test that exact single action strings are parsed correctly."""
    raw = "mouse_click(500, 500)"
    
    action = _try_parse_single_action(raw)
    
    assert action == "mouse_click(500, 500)", f"Expected mouse_click(500, 500), got {action}"
    print("✓ test_exact_single_action passed")


def test_code_fences_stripped():
    """Test that markdown code fences are stripped."""
    raw = """<think>
Looking at the screenshot...
</think>

```
mouse_click(600, 400)
```"""
    
    thinking, action = _extract_thinking_and_action(raw, "coord")
    
    assert action == "mouse_click(600, 400)", f"Expected mouse_click(600, 400), got {action}"
    print("✓ test_code_fences_stripped passed")


def test_find_last_valid_action_helper():
    """Test the _find_last_valid_action helper function."""
    # Fake actions followed by valid action
    function_calls = [
        ("around", [530, 410]),
        ("coordinates", [10, 20]),
        ("mouse_click", [500, 500]),
    ]
    
    action = _find_last_valid_action(function_calls, "coord")
    
    assert action == "mouse_click(500, 500)", f"Expected mouse_click(500, 500), got {action}"
    print("✓ test_find_last_valid_action_helper passed")


def test_transform_2coord_actions():
    """Test coordinate transformation for 2-coordinate actions."""
    # Screen is 1280x720
    action = "mouse_click(500, 500)"
    transformed = _transform_normalized_to_pixel(action, 1280, 720)
    
    # 500/1000 * 1280 = 640, 500/1000 * 720 = 360
    assert transformed == "mouse_click(640, 360)", f"Expected mouse_click(640, 360), got {transformed}"
    print("✓ test_transform_2coord_actions passed")


def test_transform_mouse_dblclick():
    """Test coordinate transformation for mouse_dblclick."""
    action = "mouse_dblclick(250, 750)"
    transformed = _transform_normalized_to_pixel(action, 1280, 720)
    
    # 250/1000 * 1280 = 320, 750/1000 * 720 = 540
    assert transformed == "mouse_dblclick(320, 540)", f"Expected mouse_dblclick(320, 540), got {transformed}"
    print("✓ test_transform_mouse_dblclick passed")


def test_transform_4coord_drag_and_drop():
    """Test coordinate transformation for mouse_drag_and_drop with 4 coordinates."""
    action = "mouse_drag_and_drop(100, 200, 800, 600)"
    transformed = _transform_normalized_to_pixel(action, 1280, 720)
    
    # from: 100/1000 * 1280 = 128, 200/1000 * 720 = 144
    # to: 800/1000 * 1280 = 1024, 600/1000 * 720 = 432
    assert transformed == "mouse_drag_and_drop(128, 144, 1024, 432)", f"Expected mouse_drag_and_drop(128, 144, 1024, 432), got {transformed}"
    print("✓ test_transform_4coord_drag_and_drop passed")


def test_invalid_action_not_in_valid_set():
    """Test that invalid actions like 'around' are not in valid sets."""
    assert "around" not in VALID_COORD_ACTIONS, "around should not be a valid action"
    assert "coordinates" not in VALID_COORD_ACTIONS, "coordinates should not be a valid action"
    assert "approximately" not in VALID_COORD_ACTIONS, "approximately should not be a valid action"
    print("✓ test_invalid_action_not_in_valid_set passed")


def test_keyboard_actions_preserved():
    """Test that keyboard actions are not affected by coordinate transform."""
    action = "keyboard_type('hello world')"
    transformed = _transform_normalized_to_pixel(action, 1280, 720)
    
    assert transformed == action, f"Keyboard action should not be transformed"
    print("✓ test_keyboard_actions_preserved passed")


def test_no_think_tags_action_at_end():
    """Test: no <think> tags, reasoning text then action at end — common Kimi K2.5 style."""
    raw = """Looking at the screenshot, I can see a text input field. The field appears to be 
located in the center-left area of the page. I need to click on it to start typing.

Based on the coordinate grid, the input field is approximately at position x=350, y=420 
in the normalized coordinate system.

mouse_click(350, 420)"""
    
    thinking, action = _extract_thinking_and_action(raw, "coord")
    
    assert action == "mouse_click(350, 420)", f"Expected mouse_click(350, 420), got {action}"
    assert thinking is not None, "Should extract reasoning as thinking"
    assert "text input field" in thinking, "Thinking should contain the reasoning text"
    assert "mouse_click" not in thinking, "Thinking should not contain the action itself"
    print("✓ test_no_think_tags_action_at_end passed")


def test_no_think_tags_with_fake_coordinates():
    """Test: no <think> tags, reasoning mentions coordinates(x,y), real action at end."""
    raw = """The button shows coordinates(450, 300) in its tooltip. I should click at position
(450, 300) to interact with it. Let me use the correct action format.

mouse_click(450, 300)"""
    
    thinking, action = _extract_thinking_and_action(raw, "coord")
    
    assert action == "mouse_click(450, 300)", f"Expected mouse_click(450, 300), got {action}"
    print("✓ test_no_think_tags_with_fake_coordinates passed")


def main():
    """Run all tests."""
    print("=" * 60)
    print("Running action parsing regression tests...")
    print("=" * 60)
    print()
    
    tests = [
        test_think_tags_with_fake_action_in_reasoning,
        test_think_tags_bid_mode,
        test_no_think_tags_last_valid_action,
        test_multiple_valid_actions_takes_last,
        test_exact_single_action,
        test_code_fences_stripped,
        test_find_last_valid_action_helper,
        test_transform_2coord_actions,
        test_transform_mouse_dblclick,
        test_transform_4coord_drag_and_drop,
        test_invalid_action_not_in_valid_set,
        test_keyboard_actions_preserved,
        test_no_think_tags_action_at_end,
        test_no_think_tags_with_fake_coordinates,
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except AssertionError as e:
            print(f"✗ {test.__name__} FAILED: {e}")
            failed += 1
        except Exception as e:
            print(f"✗ {test.__name__} ERROR: {e}")
            failed += 1
    
    print()
    print("=" * 60)
    print(f"Results: {passed} passed, {failed} failed")
    print("=" * 60)
    
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
