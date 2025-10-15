# 🎨 Quote Form Test & Customization Studio

**Interactive Design & Testing Environment**  
**Created:** October 14, 2025  

---

## 🚀 HOW TO USE

### **1. Open the Test Studio**

```bash
# Option A: Use existing preview server (if running)
# Visit: http://localhost:5500/quote-form-test-studio.html

# Option B: Start a new server
cd /workspaces/data-folder
npx serve . -p 3000
# Visit: http://localhost:3000/quote-form-test-studio.html
```

### **2. Click "Customize Design" Button**

A sleek dark panel will slide in from the right with all customization controls!

---

## ✨ FEATURES

### **🧪 Quick Tests**

**Auto-Fill Form**
- Instantly populates all fields with test data
- Tests: Property type, contact info, date selection
- Perfect for: Rapid testing without manual entry

**Test Validation**
- Clears form and triggers validation
- Shows: Error messages, field highlighting
- Perfect for: Checking validation rules

**Mobile View**
- Switches to 375px mobile viewport
- Tests: Responsive design, mobile bar
- Perfect for: Mobile UX verification

**Reset Form**
- Clears all data and returns to step 1
- Tests: State management, cleanup
- Perfect for: Starting fresh

---

### **🎨 Color Presets**

**Default (Sky Blue)**
- Primary: #0ea5e9 (Sky 500)
- Accent: #f59e0b (Amber 500)
- Style: Professional, trustworthy

**Purple Elegance**
- Primary: #8b5cf6 (Violet 500)
- Accent: #f59e0b (Amber 500)
- Style: Modern, creative

**Fresh Green**
- Primary: #10b981 (Emerald 500)
- Accent: #f59e0b (Amber 500)
- Style: Natural, eco-friendly

**Bold Red**
- Primary: #f43f5e (Rose 500)
- Accent: #fbbf24 (Amber 400)
- Style: Energetic, urgent

---

### **🎛️ Custom Controls**

**Primary Brand Color**
- Visual color picker
- Hex code input
- Live preview
- Auto-adjusts: Dark/light variants

**Accent Color**
- Highlight color for special elements
- Used in: Success messages, badges

**Border Radius**
- Range: 0px - 24px
- Affects: Cards, buttons, inputs
- Style: Sharp → Rounded

**Base Font Size**
- Range: 14px - 20px
- Affects: All text elements
- Accessibility: Larger = easier to read

**Shadow Intensity**
- None: Flat design
- Light: Subtle depth
- Medium: Balanced (default)
- Heavy: Dramatic 3D effect

---

### **📤 Export/Import**

**Export CSS**
- Downloads custom styles as CSS file
- File: `quote-form-custom.css`
- Use: Add to your project

**Copy to Clipboard**
- Copies CSS to clipboard
- Quick paste into existing files
- Perfect for: Quick testing

---

## 🧪 TESTING CHECKLIST

Use this checklist to ensure everything works:

### **Step 1: Property Details**
- [ ] Select property type (House/Apartment/Townhouse)
- [ ] Change bedrooms (1-5)
- [ ] Change bathrooms (1-3)
- [ ] Toggle "Pets at property"
- [ ] Toggle "Has carpeted rooms"
- [ ] Toggle "Balcony/Patio"
- [ ] Toggle "External windows reachable"
- [ ] Toggle "2+ storeys"
- [ ] Click "Next" button
- [ ] Verify validation (property type required)

### **Step 2: Add-ons**
- [ ] See "Standard Bond Clean" included
- [ ] Click "What's included?" button
- [ ] See included services list
- [ ] Check "Recommended" badges appear (based on step 1 toggles)
- [ ] Select one or more add-ons
- [ ] Click "Back" button (returns to step 1)
- [ ] Click "Next" button again
- [ ] Verify selected add-ons persist

### **Step 3: Contact Information**
- [ ] Enter full name
- [ ] Enter phone (try invalid: shows error)
- [ ] Enter valid AU phone (0412345678)
- [ ] Enter email (try invalid: shows error)
- [ ] Enter valid email
- [ ] Enter property address
- [ ] Click calendar icon
- [ ] Select a future date
- [ ] See date populate in field
- [ ] Enter special requests (optional)
- [ ] Click "Additional details" button
- [ ] Enter exit date (optional)
- [ ] Enter PM contact (optional)
- [ ] Click "Next" button

### **Step 4: Review**
- [ ] See all property details
- [ ] See all contact information
- [ ] See selected services listed
- [ ] See optional fields (if filled)
- [ ] Click "Back" to edit
- [ ] Return to review
- [ ] Click "Lock in my guaranteed quote"
- [ ] (Form submits to Netlify in production)

### **Mobile Testing**
- [ ] Click "Mobile View" in test panel
- [ ] Verify sticky mobile bar appears
- [ ] Test "Back" button in mobile bar
- [ ] Test "Next" button in mobile bar
- [ ] Verify no duplicate buttons
- [ ] Test all steps in mobile view
- [ ] Return to desktop view

### **Design Customization**
- [ ] Try each color preset
- [ ] Adjust primary color
- [ ] Adjust accent color
- [ ] Change border radius
- [ ] Change font size
- [ ] Change shadow intensity
- [ ] Export CSS
- [ ] Copy to clipboard

---

## 🎨 DESIGN BEST PRACTICES

### **Color Selection**

**Brand Colors:**
- Choose colors that match your brand
- Ensure sufficient contrast (WCAG AA)
- Test on both light and dark backgrounds

**Accent Colors:**
- Use sparingly for emphasis
- Should contrast with primary
- Avoid clashing combinations

### **Typography**

**Font Size:**
- 16px: Standard (default)
- 18px: Enhanced readability
- 14px: Compact layouts

**Considerations:**
- Mobile: Minimum 16px (prevents zoom)
- Accessibility: Larger = better
- Context: Forms need readable text

### **Spacing & Rhythm**

**Border Radius:**
- 0-4px: Sharp, professional
- 8-12px: Friendly, modern (default)
- 16-24px: Playful, rounded

**Shadow Intensity:**
- None: Flat design, minimalist
- Light: Subtle, elegant
- Medium: Balanced, professional (default)
- Heavy: Dramatic, attention-grabbing

---

## 🐛 TROUBLESHOOTING

### **Panel Won't Open**
- Check console for JavaScript errors
- Ensure quote-form-preview.html exists
- Try refreshing the page

### **Changes Not Applying**
- Iframe might not be loaded yet
- Wait 2-3 seconds after page load
- Check if iframe src is correct

### **Colors Look Wrong**
- Check browser color profile
- Try different presets
- Ensure contrast is sufficient

### **Mobile View Issues**
- Clear browser cache
- Test in real device
- Check viewport meta tag

---

## 💡 PRO TIPS

1. **Start with Presets**
   - Try each preset before custom colors
   - Presets are professionally balanced
   - Build on what works

2. **Test Dark Mode**
   - Check form on dark backgrounds
   - Ensure text is readable
   - Verify shadow visibility

3. **Print Your Changes**
   - Export CSS frequently
   - Save variations for comparison
   - Document your favorite styles

4. **User Test**
   - Have others try the form
   - Watch for confusion points
   - Iterate based on feedback

5. **Performance Check**
   - Heavy shadows = slower render
   - Large fonts = more scrolling
   - Balance beauty and speed

---

## 📚 RESOURCES

**Color Tools:**
- Coolors.co - Color palette generator
- Contrast-ratio.com - Check WCAG compliance
- Paletton.com - Color scheme designer

**Testing Tools:**
- BrowserStack - Cross-browser testing
- Chrome DevTools - Mobile emulation
- WAVE - Accessibility checker

**Design Inspiration:**
- Dribbble.com - UI inspiration
- Behance.net - Form designs
- Awwwards.com - Best web designs

---

## 🎯 NEXT STEPS

1. **Test thoroughly** using checklist above
2. **Customize** to match your brand
3. **Export** your final CSS
4. **Integrate** into production
5. **Monitor** user feedback
6. **Iterate** based on data

---

## 🤝 SUPPORT

**Test Studio Issues:**
- Check console for errors
- Ensure all files are present
- Try different browsers

**Form Issues:**
- See: ISSUE_RESOLUTION.md
- See: new-quote-form/README.md
- Contact: NEXUS for analysis

---

**Status:** ✅ Ready for Testing  
**Features:** 🎨 Full Customization  
**Quality:** ⭐⭐⭐⭐⭐ Professional  

**Happy Testing & Designing!** 🚀
