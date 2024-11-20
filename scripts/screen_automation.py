#!/usr/bin/env python3

import pyautogui
import time
import logging
from typing import Tuple, Optional
import sys

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Configure PyAutoGUI settings
pyautogui.FAILSAFE = True  # Move mouse to upper-left corner to abort
pyautogui.PAUSE = 0.5  # Add pause between actions

class ScreenAutomation:
    def __init__(self):
        # Get the screen size
        self.screen_width, self.screen_height = pyautogui.size()
        logging.info(f"Screen size: {self.screen_width}x{self.screen_height}")

    def find_on_screen(self, image_path: str) -> Optional[Tuple[int, int]]:
        """Find an image on screen and return its position."""
        try:
            position = pyautogui.locateOnScreen(image_path, confidence=0.9)
            if position:
                return pyautogui.center(position)
            return None
        except Exception as e:
            logging.error(f"Error finding image {image_path}: {e}")
            return None

    def click_position(self, x: int, y: int, duration: float = 0.5):
        """Smoothly move to a position and click."""
        try:
            pyautogui.moveTo(x, y, duration=duration)
            pyautogui.click()
            logging.info(f"Clicked at position ({x}, {y})")
        except Exception as e:
            logging.error(f"Error clicking at position ({x}, {y}): {e}")

    def type_text(self, text: str, interval: float = 0.1):
        """Type text with a natural interval between keystrokes."""
        try:
            pyautogui.typewrite(text, interval=interval)
            logging.info(f"Typed text: {text}")
        except Exception as e:
            logging.error(f"Error typing text: {e}")

    def take_screenshot(self, region: Optional[Tuple[int, int, int, int]] = None) -> bool:
        """Take a screenshot of the entire screen or a specific region."""
        try:
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            filename = f"screenshot_{timestamp}.png"
            if region:
                screenshot = pyautogui.screenshot(region=region)
            else:
                screenshot = pyautogui.screenshot()
            screenshot.save(filename)
            logging.info(f"Screenshot saved as {filename}")
            return True
        except Exception as e:
            logging.error(f"Error taking screenshot: {e}")
            return False

    def drag_mouse(self, start_x: int, start_y: int, end_x: int, end_y: int, duration: float = 1.0):
        """Perform a mouse drag operation from start to end coordinates."""
        try:
            pyautogui.moveTo(start_x, start_y, duration=duration/2)
            pyautogui.mouseDown()
            pyautogui.moveTo(end_x, end_y, duration=duration/2)
            pyautogui.mouseUp()
            logging.info(f"Dragged from ({start_x}, {start_y}) to ({end_x}, {end_y})")
        except Exception as e:
            logging.error(f"Error during mouse drag: {e}")

def main():
    """Example usage of the ScreenAutomation class."""
    automation = ScreenAutomation()
    
    # Example: Move mouse in a square pattern
    print("Moving mouse in a square pattern...")
    center_x = automation.screen_width // 2
    center_y = automation.screen_height // 2
    
    # Define square corners relative to center
    size = 100
    corners = [
        (center_x - size, center_y - size),
        (center_x + size, center_y - size),
        (center_x + size, center_y + size),
        (center_x - size, center_y + size),
    ]
    
    # Move mouse through corners
    for x, y in corners:
        automation.click_position(x, y, duration=1.0)
    
    # Take a screenshot
    automation.take_screenshot()
    
    print("Demo completed! Check the logs for details.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nScript terminated by user.")
        sys.exit(0)
