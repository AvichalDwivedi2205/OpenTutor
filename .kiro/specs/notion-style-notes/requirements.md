# Requirements Document

## Introduction

This feature redesigns the existing SessionNotes system to provide a Notion-like experience with a single editable markdown page, AI enhancement capabilities, and seamless integration with the Drona AI assistant. The goal is to create an intuitive, modern note-taking experience that eliminates the need for separate view/edit modes while providing intelligent content enhancement.

## Requirements

### Requirement 1

**User Story:** As a student, I want to edit my notes directly in a single page without switching between view and edit modes, so that I can have a seamless note-taking experience like Notion.

#### Acceptance Criteria

1. WHEN a user navigates to `/workspace/[id]/notes/[noteId]` THEN the system SHALL display a single page with an editable Tiptap markdown editor replacing the current read-only view
2. WHEN a user clicks anywhere in the note content area THEN the system SHALL allow immediate editing without any mode switching or navigation
3. WHEN a user makes changes to the note THEN the system SHALL show a subtle "saving..." indicator in the UI
4. WHEN a user presses Ctrl+S (or Cmd+S) THEN the system SHALL manually trigger a save operation
5. IF the note content changes THEN the system SHALL implement auto-save functionality with debounced saving

### Requirement 2

**User Story:** As a student, I want to select text in my notes and get AI enhancement suggestions through a Notion-like popup interface, so that I can improve my note content with intelligent assistance.

#### Acceptance Criteria

1. WHEN a user selects text in the Tiptap editor THEN the system SHALL display a floating popup toolbar with AI enhancement options positioned near the selection
2. WHEN a user clicks "Explain with Drona" in the popup THEN the system SHALL trigger an AI explanation request with the selected text
3. WHEN a user clicks "Enhance Notes" in the popup THEN the system SHALL trigger an AI enhancement request for the selected content
4. WHEN the popup appears THEN it SHALL have a modern, clean design consistent with Notion's selection toolbar
5. WHEN a user clicks outside the selection or deselects text THEN the popup SHALL disappear smoothly
6. IF no text is selected THEN the popup SHALL remain hidden

### Requirement 3

**User Story:** As a student, I want to use Tiptap as a rich markdown editor with formatting options, so that I can create well-structured and visually appealing notes with a modern editing experience.

#### Acceptance Criteria

1. WHEN the note page loads THEN the system SHALL initialize a Tiptap editor instance with markdown support
2. WHEN a user types in the Tiptap editor THEN the system SHALL support standard markdown syntax with real-time rendering (headers, lists, bold, italic, links, code blocks)
3. WHEN a user uses keyboard shortcuts THEN the Tiptap editor SHALL apply formatting (Ctrl+B for bold, Ctrl+I for italic, etc.)
4. WHEN a user creates lists THEN the Tiptap editor SHALL support both ordered and unordered lists with proper indentation and list continuation
5. WHEN a user adds code blocks THEN the Tiptap editor SHALL provide syntax highlighting and proper formatting
6. IF the user adds links THEN the Tiptap editor SHALL make them clickable and properly formatted with link previews

### Requirement 4

**User Story:** As a student, I want my notes to maintain the same visual design and navigation as the current system, so that the experience feels consistent with the rest of the application.

#### Acceptance Criteria

1. WHEN a user views a note THEN the system SHALL maintain the current header design with back button, title, and action buttons
2. WHEN a user views a note THEN the system SHALL preserve the current styling, colors, and layout structure
3. WHEN a user navigates back THEN the system SHALL return to the workspace page as before
4. WHEN a user stars a note THEN the system SHALL maintain the current starring functionality
5. IF the note has tags THEN the system SHALL display them in the same format as the current design

### Requirement 5

**User Story:** As a student, I want the AI enhancement features to integrate seamlessly with the existing Drona system, so that I can leverage the same AI capabilities I use elsewhere in the application.

#### Acceptance Criteria

1. WHEN the system calls Drona for explanations THEN it SHALL use the existing Drona API endpoints
2. WHEN the system calls Drona for enhancements THEN it SHALL maintain the same response format as other Drona interactions
3. WHEN Drona provides responses THEN the system SHALL handle errors gracefully with appropriate user feedback
4. WHEN the user interacts with Drona responses THEN the system SHALL provide options to accept, reject, or modify suggestions
5. IF Drona is unavailable THEN the system SHALL show appropriate error messages and disable AI features temporarily

### Requirement 6

**User Story:** As a student, I want the note editor to be performant and responsive, so that I can take notes without lag or interruption during my learning sessions.

#### Acceptance Criteria

1. WHEN a user types in the editor THEN the system SHALL respond with minimal latency (< 100ms)
2. WHEN auto-save occurs THEN it SHALL not interrupt the user's typing experience
3. WHEN the note content is large THEN the editor SHALL maintain smooth scrolling and editing performance
4. WHEN multiple formatting operations are applied THEN the system SHALL handle them efficiently without blocking the UI
5. IF the note fails to save THEN the system SHALL retry automatically and notify the user of any persistent issues

###### Important
Use tiptap for making markdown based notes