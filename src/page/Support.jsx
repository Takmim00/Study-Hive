import { FileText, Video, AlertCircle, MessageCircle, Phone, Mail, Clock, Search, ChevronRight } from "lucide-react"

const Support = () => {
  const supportItems = [
    {
      title: "Articles & FAQ",
      description:
        "Learn more about Tutor Platform and how to get things done. Have a quick question? This is also the space for all frequently asked questions.",
      image: "https://i.ibb.co.com/B51mqYJW/img1.webp",
      icon: FileText,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      buttonText: "Browse Articles",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Video Tutorials",
      description:
        "Watch our video tutorials to learn all ins and outs of Tutor Platform. Leave your email below to get a chance to join our webinars and live Q&As.",
      image: "https://i.ibb.co.com/tMw200Zb/img2.webp",
      icon: Video,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      extraText: "(coming soon)",
      buttonText: "Watch Videos",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    },
    {
      title: "Report an Issue",
      description: "Click above to report an issue through the report dialog or shoot us an email at",
      email: "support@tutor-platform.com",
      hours: "Weekdays, 9:00 - 19:00 CET",
      image: "https://i.ibb.co.com/nMB8n4P6/img3.webp",
      icon: AlertCircle,
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      buttonText: "Report Issue",
      buttonColor: "bg-pink-600 hover:bg-pink-700",
    },
  ]

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      status: "Online",
      statusColor: "bg-green-500",
    },
    {
      icon: Phone,
      title: "Call Support",
      description: "+1 (555) 123-4567",
      status: "Available",
      statusColor: "bg-blue-500",
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Get help via email",
      status: "24/7",
      statusColor: "bg-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="w-11/12 mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-blue-100 text-lg mb-8">
            Find answers, get support, and learn how to make the most of Tutor Platform
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles, tutorials, or common questions..."
              className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      <div className="w-11/12 mx-auto px-4 py-12">
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Need immediate help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <action.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <span className={`w-2 h-2 rounded-full ${action.statusColor}`}></span>
                      <span className="text-xs text-gray-500">{action.status}</span>
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Support Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportItems.map((item, index) => (
              <div
                key={index}
                className={`${item.bgColor} ${item.borderColor} border-2 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full`}
              >
                <div className="relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}{" "}
                    {item.extraText && <span className="text-sm text-gray-500 font-normal">{item.extraText}</span>}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed flex-grow">{item.description}</p>

                  {item.email && (
                    <div className="mb-4 p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <p className="font-semibold text-gray-900">{item.email}</p>
                      </div>
                      {item.hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-600">{item.hours}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    className={`w-full ${item.buttonColor} text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 mt-auto`}
                  >
                    {item.buttonText}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Help Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "How to find the right tutor for your needs",
              "Setting up your first tutoring session",
              "Payment methods and billing information",
              "Cancellation and rescheduling policies",
              "How to become a verified tutor",
              "Troubleshooting video call issues",
            ].map((article, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700 hover:text-blue-600">{article}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Footer */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h3>
            <p className="text-gray-600 mb-6">Our support team is here to help you succeed</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Contact Support
              </button>
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors">
                Schedule a Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support
