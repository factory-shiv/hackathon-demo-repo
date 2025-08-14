# Advanced Operations Guide

This guide explains the three **advanced operations** added to the Calculator App—Square Root, Square, and Reciprocal—and how to use them with both the mouse and keyboard. It is intended for QA testers and end-users who want a quick reference.

---

## 1. What’s New?
A dedicated **purple row of buttons** has been introduced beneath the function keys.  
These buttons perform:

1. Square Root (√)  
2. Square (x²)  
3. Reciprocal (1/x)

Each operation can be triggered with a click or its keyboard shortcut.

---

## 2. Operation Details

| Operation | Button Label | Keyboard Shortcut | Description |
|-----------|--------------|-------------------|-------------|
| Square Root | **√** | **R** | Calculates the non-negative square root of the current display value. |
| Square      | **x²** | **S** | Squares the current display value (multiplies it by itself). |
| Reciprocal  | **1/x** | **I** | Returns the multiplicative inverse of the current display value. |

---

## 3. Usage Examples

1. **Square Root**
   1. Enter `9`.
   2. Click **√** (or press **R**).  
      **Expected Display:** `3`

2. **Square**
   1. Enter `4`.
   2. Click **x²** (or press **S**).  
      **Expected Display:** `16`

3. **Reciprocal**
   1. Enter `8`.
   2. Click **1/x** (or press **I**).  
      **Expected Display:** `0.125`

---

## 4. Edge-Case Behavior

| Scenario | Expected Result | Notes |
|----------|-----------------|-------|
| Square root of a negative number (e.g., `-9`, then **√**) | `NaN` appears in display | Calculator follows JavaScript’s `Math.sqrt` behavior. |
| Reciprocal of `0` (enter `0`, then **1/x**) | `NaN` appears in display | Division by zero returns `NaN`, matching spec. |
| Chaining (e.g., `√9 + 5`) | Not supported | Advanced operation applies immediately to the current display only. |

---

## 5. Visual Design

• **Purple Buttons:** Advanced operations use a violet background (`#6f4af6`) to visually separate them from other keys.  
• **Hover/Active States:** Slightly lighter/darker purple shades give feedback on hover, click, and keyboard activation.  
• **Consistency:** Font size, rounded corners, and drop shadows match existing key styling for a cohesive look.

---

### Happy Calculating!
