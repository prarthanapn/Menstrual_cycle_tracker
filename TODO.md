# Menstrual Health Tracker - Frontend Fixes TODO

## API Updates
- [x] Update `api.js`: Fix authAPI.register to send (name, email, password, dob, age_group, height_cm, weight_kg, blood_group)
- [x] Update `api.js`: Fix cyclesAPI.add to include flow_level, pain_level, notes (flow_level required)
- [x] Update `api.js`: Fix chatbotAPI.sendMessage to call '/chat' instead of '/chatbot'
- [x] Update `api.js`: Fix symptomsAPI.add to include notes field

## Page Redesigns
- [ ] Redesign `Register.jsx`: Implement conversational chat-style onboarding collecting name, age_group (teen/adult), dob, height_cm, weight_kg, blood_group
- [ ] Redesign `TrackCycle.jsx`: Add calendar view, flow_level picker with icons (light/moderate/heavy), pain_level slider, notes textarea
- [ ] Fix `Chatbot.jsx`: Change API call to '/chat'
- [ ] Update `LogSymptoms.jsx`: Add notes textarea

## UI/UX Improvements
- [ ] Update `index.css`: Implement full pastel theme (#FDECEF, #F6F0FF, #FFF3E4, #E3F6F5, #FFE7EF)
- [ ] Update `index.css`: Ensure mobile-first responsive design
- [ ] Update `index.css`: Implement card-based layout with animations
- [ ] Ensure all pages have bottom navigation, conversational UI, and animations

## Testing & Verification
- [ ] Test registration with new conversational flow and backend fields
- [ ] Test cycle tracking with calendar, flow/pain levels, notes
- [ ] Test chatbot with correct endpoint
- [ ] Verify mobile responsiveness and pastel theme across all pages
- [ ] Add educational content page if needed
- [ ] Test all API integrations
