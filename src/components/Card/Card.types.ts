/**
 * Card component types – Figma 419:17380 (default), 419-17403 / 878-1814 (editable).
 * Default: icon/image + title/subtitle, optional 3-dot actions, subtext, footer.
 * Editable variant: view (key-value rows + edit/delete) and edit mode (upload image + form + Save/Cancel).
 */
import type React from 'react';

/** Single field for editable card view mode: label and display value. */
export type CardViewField = {
  id: string;
  label: string;
  value: string;
};

/** Single field for editable card edit mode: label, controlled value, change handler. */
export type CardEditField = {
  id: string;
  label: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
};

export type CardVariant = 'default' | 'editable';

export type CardProps = {
  /** Visual variant: default (icon/subtext/footer) or editable (view/edit modes). */
  variant?: CardVariant;
  /** Icon shown in top-left circle when no imageSrc. */
  icon?: React.ReactNode;
  /** Image URL for top-left circle; when set, replaces icon (e.g. after upload). */
  imageSrc?: string;
  /** Alt text for image in top-left circle. */
  imageAlt?: string;
  /** Title (bold) next to the icon/image. */
  title: string;
  /** Subtitle (smaller, subtle) below the title. Default variant only. */
  subtitle?: string;
  /** When set, renders 3-dot IconButton (small) top right; onClick when clicked. Default variant. */
  onActionsClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Body text (subtext) below the header. Default variant only. */
  subtext?: string;
  /** Footer content. Primary button should be first (left-aligned). */
  footer?: React.ReactNode;
  /** Additional class name. */
  className?: string;
  /* --- Editable variant only --- */
  /** When false: view mode – title, key-value rows, edit/delete. When true: edit form. */
  isEditing?: boolean;
  /** Key-value rows in view mode. */
  viewFields?: CardViewField[];
  /** Called when edit (pencil) is clicked. */
  onEditClick?: () => void;
  /** Called when delete (trash) is clicked. */
  onDeleteClick?: () => void;
  /** Edit mode: form fields. */
  editFields?: CardEditField[];
  /** Edit mode: called when "Upload image" is clicked. Consumer handles file picker and sets imageSrc. */
  onUploadImageClick?: () => void;
  /** Edit mode: called when Save is clicked. */
  onSaveEdit?: () => void;
  /** Edit mode: called when Cancel is clicked. */
  onCancelEdit?: () => void;
};
