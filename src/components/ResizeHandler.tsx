import React, { useEffect } from 'react';

const ResizeHandler: React.FC = () => {
  useEffect(() => {
    let isResizing = false;
    let activeResizer: HTMLElement | null = null;
    let startX = 0;
    let startY = 0;
    let startWidths: number[] = [];
    let minWidths: number[] = [];
    let panes: HTMLElement[] = [];

    function initResize(e: MouseEvent) {
      const resizer = (e.target as HTMLElement).closest('.resizer');
      if (!resizer || isResizing) return;

      e.preventDefault();
      isResizing = true;
      activeResizer = resizer as HTMLElement;
      startX = e.pageX;
      startY = e.pageY;

      const direction = activeResizer.dataset.direction || 'vertical';
      const isHorizontal = direction === 'horizontal';
      const parentIndex = activeResizer.dataset.parentIndex;

      if (parentIndex !== undefined) {
        // Handle split pane resize
        const parentPane = document.querySelector(`.pane[data-index="${parentIndex}"]`);
        const splitPane = parentPane?.querySelector('.split-pane');
        const splitPanes = Array.from(splitPane?.querySelectorAll('.split-pane-child') || []);

        if (splitPanes.length >= 2) {
          const style1 = window.getComputedStyle(splitPanes[0]);
          const style2 = window.getComputedStyle(splitPanes[1]);
          startWidths = [
            parseFloat(style1.flexGrow) || 1,
            parseFloat(style2.flexGrow) || 1
          ];
        }
      } else {
        // Handle main pane resize
        const index = parseInt(activeResizer.dataset.index || '0', 10);
        const allPanes = document.querySelectorAll('.pane');
        
        // Get all panes for width calculations
        panes = Array.from(allPanes) as HTMLElement[];
        
        // Store initial widths and minimum widths
        startWidths = panes.map(pane => pane.getBoundingClientRect().width);
        minWidths = panes.map(pane => parseInt(pane.getAttribute('data-min-width') || '200'));
      }

      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
      document.body.style.cursor = isHorizontal ? 'row-resize' : 'col-resize';
      document.body.style.userSelect = 'none';
    }

    function resize(e: MouseEvent) {
      if (!isResizing || !activeResizer) return;

      e.preventDefault();
      const direction = activeResizer.dataset.direction || 'vertical';
      const isHorizontal = direction === 'horizontal';
      const parentIndex = activeResizer.dataset.parentIndex;

      if (parentIndex !== undefined) {
        // Handle split pane resize
        const parentPane = document.querySelector(`.pane[data-index="${parentIndex}"]`);
        const splitPane = parentPane?.querySelector('.split-pane');
        const splitPanes = Array.from(splitPane?.querySelectorAll('.split-pane-child') || []);

        if (splitPanes.length < 2) return;

        const containerRect = splitPane?.getBoundingClientRect();
        if (!containerRect) return;

        const delta = isHorizontal ? (e.pageY - startY) : (e.pageX - startX);
        const totalSize = isHorizontal ? containerRect.height : containerRect.width;

        // Calculate new flex values
        const flexDelta = (delta / totalSize);
        let newFlex1 = Math.max(0.1, Math.min(1.9, startWidths[0] + flexDelta));
        let newFlex2 = Math.max(0.1, Math.min(1.9, startWidths[1] - flexDelta));

        // Normalize flex values to sum to 2
        const totalFlex = newFlex1 + newFlex2;
        if (totalFlex !== 2) {
          const scale = 2 / totalFlex;
          newFlex1 *= scale;
          newFlex2 *= scale;
        }

        // Apply new flex values
        splitPanes[0].style.flex = `${newFlex1} ${newFlex1} 0%`;
        splitPanes[1].style.flex = `${newFlex2} ${newFlex2} 0%`;
      } else {
        if (panes.length < 2) return;

        const index = parseInt(activeResizer.dataset.index || '0', 10);
        const delta = e.pageX - startX;

        // Calculate new widths
        const newWidths = [...startWidths];
        
        // Update widths based on delta
        if (index === 0) {
            // First resizer
            const maxDelta = Math.min(
                startWidths[1] - minWidths[1],  // How much middle pane can shrink
                startWidths[0] + delta < minWidths[0] ? 0 : delta  // Don't let first pane go below min
            );
            const minDelta = Math.max(
                -(startWidths[0] - minWidths[0]),  // Don't let first pane go below min
                -(startWidths[1] - minWidths[1])   // Don't let second pane go below min
            );
            
            const adjustedDelta = Math.max(minDelta, Math.min(maxDelta, delta));
            newWidths[0] = startWidths[0] + adjustedDelta;
            newWidths[1] = startWidths[1] - adjustedDelta;
        } else {
            // Second resizer
            const maxDelta = Math.min(
                startWidths[2] - minWidths[2],  // How much last pane can shrink
                startWidths[1] + delta < minWidths[1] ? 0 : delta  // Don't let middle pane go below min
            );
            const minDelta = Math.max(
                -(startWidths[1] - minWidths[1]),  // Don't let middle pane go below min
                -(startWidths[2] - minWidths[2])   // Don't let last pane go below min
            );
            
            const adjustedDelta = Math.max(minDelta, Math.min(maxDelta, delta));
            newWidths[1] = startWidths[1] + adjustedDelta;
            newWidths[2] = startWidths[2] - adjustedDelta;
        }

        // Apply new widths
        requestAnimationFrame(() => {
            panes.forEach((pane, i) => {
                if (newWidths[i] !== undefined) {
                    pane.style.width = `${newWidths[i]}px`;
                }
            });
        });
      }
    }

    function stopResize() {
      isResizing = false;
      activeResizer = null;
      startWidths = [];
      minWidths = [];
      panes = [];

      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
      document.body.style.removeProperty('cursor');
      document.body.style.removeProperty('user-select');
    }

    // Initialize resize handlers
    document.addEventListener('mousedown', initResize);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', initResize);
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    };
  }, []);

  return null;
};

export default ResizeHandler;
