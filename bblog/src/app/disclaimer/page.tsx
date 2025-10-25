const DisclaimerPage = () => {
  return (
    <div className="lg:mx-30 sm:mx-8 px-4 py-12">
      <h1 className="font-lora text-3xl mb-4">Disclaimer</h1>
      <p className="font-poppins text-lg mb-4">
        <strong>The Good Standard</strong> is a personal blog that shares tips,
        research, and opinions about living a more sustainable and healthy
        lifestyle. The content provided here is for general informational
        purposes only and should not be considered medical, financial, or
        professional advice. Any reliance you place on the information found on
        this site is strictly at your own risk. Always consult with a qualified
        healthcare provider before making any changes to your diet, lifestyle,
        or use of products—especially if you have medical conditions or known
        allergies. Everybody is different, what works for me may or may not work
        for you.
      </p>
      <p className="font-poppins text-lg mb-4">
        Some blog posts may contain affiliate links. This means that if you
        click on a link and decide to ultimately make the purchase, the blog may
        receive a small commission. This is at no extra cost to you. We only
        recommend products that we believe are genuinely useful, but please do
        your own research before making any purchase. The Good Standard is not
        responsible for any losses, injuries, or damages from the use of the
        information or products mentioned on the site.
      </p>
      <h2 className="font-lora text-3xl mt-8 mb-4">Privacy Policy</h2>
      <p className="font-poppins text-lg">
        At <strong>The Good Standard</strong>, we respect your privacy.
      </p>
      <ul className="font-poppins text-lg list-disc pl-5">
        <li>
          <strong>Data Collection:</strong> This website may automatically
          collect non-personal information such as cookies, IP addresses, and
          browsing behavior to improve site performance and user experience.
        </li>
        <li>
          <strong>Third Party Services:</strong> This website may use Google
          Analytics, Pinterest, and other affiliate networks such as Amazon
          Associates that collect cookies to track traffic and referral
          activity. These third parties may use cookies to serve ads or measure
          performance.
        </li>
        <li>
          <strong>Optional Cookies:</strong> You can choose to disable cookies
          at any time through your browser settings.
        </li>
        <li>
          <strong>Children’s Privacy:</strong> This website is not intended for
          children under 13, and we do not knowingly collect information from
          children.
        </li>
        <li>
          We do <strong>NOT</strong> sell, trade, or share your personal data
          with outside parties.
        </li>
      </ul>
      <p className="font-poppins">
        If you have any questions about this disclaimer or privacy policy, you
        can reach us at{" "}
        <a
          className="font-poppins underline text-blue-600"
          href="mailto:contact@thegoodstandard.org"
        >
          contact@thegoodstandard.org
        </a>
        .
      </p>
    </div>
  );
};

export default DisclaimerPage;
