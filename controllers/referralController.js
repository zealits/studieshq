exports.generateReferralLink = async (req, res) => {
  const { gigId, referringUserId } = req.body;
  console.log(req.body);

  try {
    let referralLink = "";
    if (gigId) {
      // Generate link for the entire project
      referralLink = `${req.protocol}://${req.get("host")}/share/study/${gigId}?referral=${referringUserId}`;
    } else {
      return res.status(400).json({ message: "Project or job ID required" });
    }

    res.status(200).json({ referralLink });
  } catch (error) {
    res.status(500).json({ message: "Error generating referral link" });
  }
};
