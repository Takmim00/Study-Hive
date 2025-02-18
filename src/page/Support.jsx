const Support = () => {
  const supportItems = [
    {
      title: "Articles & FAQ",
      description:
        "Learn more about Tutor Platform and how to get things done. Have a quick question? This is also the space for all frequently asked questions.",
      image: "https://i.ibb.co.com/B51mqYJW/img1.webp",
    },
    {
      title: "Video Tutorials",
      description:
        "Watch our video tutorials to learn all ins and outs of Tutor Platform. Leave your email below to get a chance to join our webinars and live Q&As.",
      image: "https://i.ibb.co.com/tMw200Zb/img2.webp",
      bgColor: "bg-yellow-200",
      extraText: "(coming soon)",
    },
    {
      title: "Report an issue",
      description:
        "Click above to report an issue through the report dialog or shoot us an email at",
      email: "support@tutor-platform.com",
      hours: "Weekdays, 9:00 - 19:00 CET",
      image: "https://i.ibb.co.com/nMB8n4P6/img3.webp",
      bgColor: "bg-pink-200",
    },
  ];

  return (
    <div>
        <div className="text-center font-bold text-3xl text-white py-4 bg-blue-400">
            Support
        </div>
      <section className="flex flex-wrap justify-center gap-6 p-8">
        {supportItems.map((item, index) => (
          <div key={index} className={`p-6 rounded-2xl w-80 `}>
            <img src={item.image} alt={item.title} className="w-full mb-4" />
            <h3 className="text-xl font-bold">
              {item.title}{" "}
              {item.extraText && (
                <span className="text-gray-500">{item.extraText}</span>
              )}
            </h3>
            <p className="text-gray-600">{item.description}</p>
            {item.email && <p className="mt-2 font-semibold">{item.email}</p>}
            {item.hours && <p className="text-gray-500">{item.hours}</p>}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Support;
