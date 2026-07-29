---
name: "Talkin' Tacos"
description: "Design tokens extracted from https://talkintacos.net/"
colors:
  primary: "#06B906"
  secondary: "#06B906"
  surface: "#DB594B"
  on-surface: "#4D4D4D"
typography:
  text-1:
    fontFamily: "Inter"
    fontSize: "70px"
    fontWeight: 500
    lineHeight: 1.2
  text-2:
    fontFamily: "Inter"
    fontSize: "56px"
    fontWeight: 600
    lineHeight: 1.2
  text-3:
    fontFamily: "Inter"
    fontSize: "56px"
    fontWeight: 500
    lineHeight: 1.11
  text-4:
    fontFamily: "Inter"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: 1.25
  text-5:
    fontFamily: "Geist"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.2
  text-6:
    fontFamily: "Inter"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.25
  text-7:
    fontFamily: "Inter"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.27
  text-8:
    fontFamily: "Inter"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.27
  text-9:
    fontFamily: "Inter"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.3
  text-10:
    fontFamily: "Inter"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  text-11:
    fontFamily: "Geist"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  text-12:
    fontFamily: "Geist"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.38
  text-13:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.38
  text-14:
    fontFamily: "Geist"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.38
  text-15:
    fontFamily: "Geist"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.43
  text-16:
    fontFamily: "Geist"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.43
  text-17:
    fontFamily: "Geist"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.43
  text-18:
    fontFamily: "Geist"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.67
  text-19:
    fontFamily: "Geist"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.67
spacing:
  base: "8px"
  xs: "1px"
  sm: "2px"
  md: "4px"
  lg: "8px"
  xl: "9px"
  xxl: "12px"
  xxxl: "16px"
  xxxxl: "20px"
rounded:
  sm: "2px"
  md: "4px"
  lg: "6px"
  xl: "8px"
  full: "9999px"
components:
  button-observed:
    backgroundColor: "#0D0D0D"
    textColor: "#FFFFFF"
    rounded: "10px"
    padding: "8px 16px"
  input-observed:
    textColor: "#FFFFFF"
    rounded: "0px"
    padding: "0px 0px 0px 40px"
---

# Design System

## Overview
Design tokens extracted from talkintacos.net. The YAML front matter contains machine-readable values observed by Dembrandt when available; the sections below summarize the extracted evidence without redesigning or correcting the source site.

## Colors
- **Primary** (#06B906): Observed color token extracted from the site's palette, semantic CSS, or component styles.
- **Secondary** (#06B906): Observed color token extracted from the site's palette, semantic CSS, or component styles.
- **Surface** (#DB594B): Observed color token extracted from the site's palette, semantic CSS, or component styles.
- **On Surface** (#4D4D4D): Observed color token extracted from the site's palette, semantic CSS, or component styles.

## Typography
- **Text 1**: Inter, 70px, medium
- **Text 2**: Inter, 56px, semi-bold
- **Text 3**: Inter, 56px, medium
- **Text 4**: Inter, 40px, medium
- **Text 5**: Geist, 28px, semi-bold
- **Text 6**: Inter, 28px, semi-bold
- **Font source**: Google Fonts (Inter, Geist)

## Layout
Observed spacing scale: 8px spacing scale.
- **Spacing tokens**: base 8px, xs 1px, sm 2px, md 4px, lg 8px, xl 9px, xxl 12px, xxxl 16px, xxxxl 20px
- **Responsive breakpoints**: 400px, 320px

## Elevation & Depth
Observed box-shadow styles: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.15) 0px 0px 0px 1px, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.15) 0px 2px 8px 0px

## Shapes
Observed rounded-corner tokens: sm 2px, md 4px, lg 6px, xl 8px, full 9999px.

## Components
- **Buttons**: Observed sample with radius 10px, background #0D0D0D, text #FFFFFF, padding 8px 16px, border 0px solid oklch(0.928 0.006 264.531)
- **Inputs**: Observed sample with 0px radius
