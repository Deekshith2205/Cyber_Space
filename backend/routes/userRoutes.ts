import express from 'express';
const router = express.Router();

let analystProfile = {
  id: "analyst-001",
  name: "Anjan Majumdar",
  email: "anjan@cyberspace.ai",
  role: "Level 4 Senior Security Analyst",
  avatarInitials: "AM",
  clearanceLevel: 4,
};

// GET current analyst profile
router.get('/profile', (req, res) => {
  res.json(analystProfile);
});

// POST update analyst profile
router.post('/profile', (req, res) => {
  const updates = req.body;
  analystProfile = { ...analystProfile, ...updates };
  
  // Recalculate initials if name updated
  if (updates.name) {
    const names = updates.name.trim().split(/\s+/);
    if (names.length >= 2) {
      analystProfile.avatarInitials = (names[0][0] + names[names.length - 1][0]).toUpperCase();
    } else if (names.length === 1 && names[0].length > 0) {
      analystProfile.avatarInitials = names[0][0].toUpperCase();
    }
  }
  
  console.log('Analyst profile updated:', analystProfile);
  res.json({ success: true, profile: analystProfile });
});

export default router;
