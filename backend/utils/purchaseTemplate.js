export const purchaseApprovedTemplate = (purchase) => {
  return {
    subject: "🎉 Your Purchase Has Been Approved!",
    html: `
      <h3>Hi ${purchase.buyerName},</h3>
      <p>We are excited to inform you that your purchase request for <b>${purchase.imageTitle}</b> has been <span style="color:green;"><b>Approved</b></span>.</p>
      <p>We will process your order shortly. Thank you for supporting our art gallery!</p>
      <br/>
      <p>Best regards,</p>
      <p><b>Thousand Shades Art</b></p>
    `,
  };
};

export const purchaseRejectedTemplate = (purchase) => {
  return {
    subject: "❌ Your Purchase Has Been Rejected",
    html: `
      <h3>Hi ${purchase.buyerName},</h3>
      <p>We regret to inform you that your purchase request for <b>${purchase.imageTitle}</b> has been <span style="color:red;"><b>Rejected</b></span>.</p>
      <p>If you believe this was a mistake, feel free to contact our support team.</p>
      <br/>
      <p>Best regards,</p>
      <p><b>Thousand Shades Art</b></p>
    `,
  };
};
