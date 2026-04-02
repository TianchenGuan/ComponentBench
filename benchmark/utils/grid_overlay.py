"""
Grid overlay utility for visual coordinate reference.

Draws a grid with NORMALIZED 0-1000 coordinate labels on screenshots to help
vision-language models estimate accurate (x, y) coordinates. Qwen3-VL and similar
models are trained to output coordinates in normalized 0-1000 scale, not pixels.
"""

from __future__ import annotations

import numpy as np
from PIL import Image, ImageDraw, ImageFont


def create_grid_overlay(
    screenshot: np.ndarray | Image.Image,
    grid_size: int = 10,
    line_color: tuple[int, int, int, int] = (255, 100, 100, 180),  # semi-transparent red
    label_color: tuple[int, int, int] = (255, 255, 0),  # yellow text
    line_width: int = 2,
) -> np.ndarray:
    """
    Overlay a grid with NORMALIZED 0-1000 coordinate labels on a screenshot.

    Labels appear at the bottom-right corner of each grid cell, showing
    normalized coordinates (0-1000 scale) of that corner (format: "x,y").

    Args:
        screenshot: Input image as numpy array (H, W, C) or PIL Image.
        grid_size: Number of grid divisions in each dimension (default 10 = 10x10 grid).
        line_color: RGBA tuple for grid lines (default semi-transparent red).
        label_color: RGB tuple for coordinate labels (default yellow).
        line_width: Width of grid lines in pixels.

    Returns:
        Annotated image as numpy array (H, W, 3) in RGB format.
    """
    # Convert numpy to PIL if needed
    if isinstance(screenshot, np.ndarray):
        img = Image.fromarray(screenshot)
    else:
        img = screenshot.copy()

    # Ensure RGBA for transparency support
    if img.mode != "RGBA":
        img = img.convert("RGBA")

    width, height = img.size
    cell_width = width / grid_size
    cell_height = height / grid_size

    # Create a transparent overlay for grid lines
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Try to load a small font; fall back to default if unavailable
    try:
        # Try common monospace fonts that exist on most systems
        font_size = max(10, min(14, int(cell_height / 6)))
        font = ImageFont.truetype("arial.ttf", font_size)
    except (OSError, IOError):
        try:
            font = ImageFont.truetype("DejaVuSans.ttf", font_size)
        except (OSError, IOError):
            font = ImageFont.load_default()

    # Draw vertical grid lines
    for i in range(1, grid_size):
        x = int(i * cell_width)
        draw.line([(x, 0), (x, height)], fill=line_color, width=line_width)

    # Draw horizontal grid lines
    for i in range(1, grid_size):
        y = int(i * cell_height)
        draw.line([(0, y), (width, y)], fill=line_color, width=line_width)

    # Draw border
    draw.rectangle([(0, 0), (width - 1, height - 1)], outline=line_color, width=line_width)

    # Add coordinate labels at grid intersections (bottom-right of each cell)
    for row in range(grid_size):
        for col in range(grid_size):
            # Bottom-right corner of this cell
            corner_x = int((col + 1) * cell_width)
            corner_y = int((row + 1) * cell_height)

            # Clamp to image bounds
            corner_x = min(corner_x, width)
            corner_y = min(corner_y, height)

            # Convert to normalized 0-1000 coordinates (Qwen3-VL format)
            normalized_x = int(corner_x / width * 1000)
            normalized_y = int(corner_y / height * 1000)
            label = f"{normalized_x},{normalized_y}"

            # Get text bounding box for positioning
            try:
                bbox = draw.textbbox((0, 0), label, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
            except AttributeError:
                # Fallback for older PIL versions
                text_width, text_height = draw.textsize(label, font=font)

            # Position label slightly inside the corner
            padding = 3
            label_x = corner_x - text_width - padding
            label_y = corner_y - text_height - padding

            # Ensure label stays within bounds
            label_x = max(padding, label_x)
            label_y = max(padding, label_y)

            # Draw a small semi-transparent background for readability
            bg_padding = 2
            bg_box = [
                label_x - bg_padding,
                label_y - bg_padding,
                label_x + text_width + bg_padding,
                label_y + text_height + bg_padding,
            ]
            draw.rectangle(bg_box, fill=(0, 0, 0, 160))

            # Draw the coordinate label
            draw.text((label_x, label_y), label, fill=label_color, font=font)

    # Composite overlay onto original image
    result = Image.alpha_composite(img, overlay)

    # Convert back to RGB numpy array
    return np.array(result.convert("RGB"))


def get_grid_cell_center(
    cell_row: int,
    cell_col: int,
    image_width: int,
    image_height: int,
    grid_size: int = 10,
) -> tuple[int, int]:
    """
    Get the center pixel coordinates of a grid cell.

    Args:
        cell_row: Row index (0-indexed from top).
        cell_col: Column index (0-indexed from left).
        image_width: Width of the image in pixels.
        image_height: Height of the image in pixels.
        grid_size: Number of grid divisions.

    Returns:
        Tuple of (x, y) pixel coordinates for the cell center.
    """
    cell_width = image_width / grid_size
    cell_height = image_height / grid_size

    center_x = int((cell_col + 0.5) * cell_width)
    center_y = int((cell_row + 0.5) * cell_height)

    return center_x, center_y

