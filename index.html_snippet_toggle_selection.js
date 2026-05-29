      function toggleSelectionMode() {
          isSelectionMode = !isSelectionMode;
          if (!isSelectionMode) {
              selectedNoteIds.clear();
          }
          render();
      }
