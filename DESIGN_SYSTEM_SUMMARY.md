# Design System Foundations - Complete Summary

This document captures all the foundational elements of your design system from Figma.

## 🎨 Brand Elements

### Logo Components
- **`logo-text`**: "CREALIEVS" text logo (two lines: "CREA" + "LIEVS")
  - Font: Bold, uppercase sans-serif
  - Color: Primary blue
  - Special: Stylized "S" in "LIEVS"
  
- **`logo-mark`**: Standalone abstract logo mark
  - Shape: Stylized "S" or flowing ribbon-like form
  - Color: Primary blue

## 🎨 Color System

### Base Colors
- **Primary Blue**: 100-1000 scale (lightest to darkest)
- **Secondary Metal**: 100-1000 scale (grays)
- **Neutral**: 100-1000 scale (pure neutrals)
- **Highlight Peach**: 100-700 scale (warm accent)
- **Accent Purple**: 100-1000 scale (purple accent)
- **Error Red**: 100-700 scale
- **Warning Orange**: 100-600 scale
- **Success Green**: 100-600 scale

### Semantic Colors
Comprehensive semantic tokens for:
- Backgrounds (primary, neutral, error, success, warning, info, accent, highlight)
- Text (primary, neutral, error, success, warning, info)
- Borders (default, action, success, warning, error, info, highlight)
- Icons (primary, neutral, success, warning, error, info, highlight, pending)

All with states: default, hover, active, subtle variants

## 📐 Spacing System

### Base Spacing
- `--1` through `--14`: 4px to 56px scale
- Incremental values: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56px

### Semantic Spacing
- Margins: x-small, small, default, large, x-large, 2x-large, 3x-large
- Padding: x-small, small, default, large, x-large, 2x-large, 3x-large

## 🔤 Typography System

### Font Families
- **Heading**: "Oswald"
- **Body**: "Open Sans"

### Font Weights
- Regular
- Semi-bold (highlight)
- Italic (cursive)

### Typography Styles (from Figma)

#### Heading Styles
- `Ag large`: 32px / 36px line-height
- `Ag medium`: 24px / 32px line-height
- `Ag small`: 20px / 28px line-height
- `Ag xsmall`: 16px / 20px line-height

#### Interface Styles
**Regular:**
- `Ag default`: 16px / 20px line-height
- `Ag small`: 14px / 18px line-height
- `Ag xsmall`: 12px / 16px line-height

**Bold:**
- `Ag default`: 16px / 20px line-height
- `Ag small`: 14px / 18px line-height
- `Ag xsmall`: 12px / 16px line-height

**Underline:**
- `Ag default`: 16px / 20px line-height
- `Ag small`: 14px / 18px line-height
- `Ag xsmall`: 12px / 16px line-height

#### Body Styles
**Regular:**
- `Ag default`: 16px / 28px line-height
- `Ag small`: 14px / 24.5px line-height
- `Ag xsmall`: 12px / 21px line-height

**Bold:**
- `Ag default`: 16px / 28px line-height
- `Ag small`: 14px / 24.5px line-height
- `Ag xsmall`: 12px / 21px line-height

### Font Size Tokens
- xs: 12px
- sm: 14px
- md: 16px
- lg: 20px
- xl: 24px
- xxl: 32px

### Line Height Tokens
- Default line heights: xs (16px), sm (18px), md (20px), lg (28px), xl (32px), xxl (36px)
- Body line heights: xs (21px), sm (24.5px), md (28px)

## 📐 Border Radius

### Base Radius
- `--radius-1`: 4px
- `--radius-2`: 12px
- `--radius-3`: 16px
- `--radius-4`: 20px
- `--radius-max`: 999px (pill shape)

### Semantic Radius
- `--soft`: 4px
- `--input`: 12px
- `--overlay`: 20px
- `--container`: 16px
- `--pill`: 999px

## 📏 Layout System

### Desktop Grid
- **Columns**: 12
- **Margin**: 120px (left/right)
- **Gutter**: 24px (between columns)
- **Max Width**: 1200px
- **Type**: Stretch columns

### Mobile Grid
- **Columns**: 4
- **Margin**: 16px (left/right)
- **Gutter**: 16px (between columns)
- **Max Width**: 1200px
- **Type**: Stretch columns

## 🎭 Border System

### Border Widths
- `--default`: 1px
- `--thick`: 3px

## 🎨 Opacity

- `--disabled`: 35% (note: token says 35px but should be 35% or 0.35)

## 🎯 Icons

- **Library**: Lucide Icons
- Icon colors are defined in semantic color tokens

## 📝 Notes

- All typography styles use the "Ag" prefix in Figma (likely a preview/placeholder text)
- The design system follows a clear hierarchy: base tokens → semantic tokens
- All semantic tokens reference base tokens using CSS variables
- Grid systems are responsive with different configurations for desktop and mobile
