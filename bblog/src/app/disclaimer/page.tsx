const DisclaimerPage = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="font-lora text-3xl mb-4 underline underline-offset-8">
        Disclaimer
      </h1>
      <p className="font-mont text-md mb-4">
        <strong>The Good Standard</strong> is a personal blog that shares my
        tips, research, and opinions about living a more sustainable and healthy
        lifestyle. The information I’ve provided here is for general
        informational purposes only—it should not be taken as financial advice.
        Any reliance you place on the information found on this site is strictly
        at your own risk.
      </p>
      <p className="font-mont text-md mb-4">
        Some blog posts may contain affiliate links. This means that if you
        click on a link and decide to ultimately make the purchase, the blog may
        receive a small commission. This is at no extra cost to you. I only
        recommend products that I believe are genuinely useful, but please do
        your own research before making any purchase. I am not responsible for
        any losses, injuries, or damages from the use of the information or
        products mentioned on the site.
      </p>
      <h2 className="font-lora text-xl mt-8 mb-4 underline underline-offset-6">
        Privacy Policy
      </h2>
      <p className="font-mont text-md">
        At <strong>The Good Standard</strong>, I respect your privacy.
      </p>
      <ul className="font-mont text-md list-disc pl-5">
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
          children under 13, and I do not knowingly collect information from
          children.
        </li>
        <li>
          I do <strong>NOT</strong> sell, trade, or share your personal data
          with outside parties.
        </li>
      </ul>
      <p>
        If you have any questions about this disclaimer or privacy policy, you
        can reach me at{" "}
        <a
          className="font-mont underline text-blue-600"
          href="mailto:thegoodstandard.company@gmail.com"
        >
          thegoodstandard.company@gmail.com
        </a>
        .
      </p>
    </div>
  );
};

export default DisclaimerPage;
