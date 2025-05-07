import { Check, X, Clock } from "lucide-react"

export function FeatureComparison() {
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-10">Feature Comparison</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-4 px-4 font-medium text-lg">Feature</th>
              <th className="text-center py-4 px-4 font-medium text-lg">Starter</th>
              <th className="text-center py-4 px-4 font-medium text-lg">Core</th>
              <th className="text-center py-4 px-4 font-medium text-lg">Power Plan</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800">
              <td className="py-4 px-4">Personalized plan</td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-4 px-4">Curriculum tools</td>
              <td className="py-4 px-4 text-center">
                <Clock className="h-5 w-5 text-yellow-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-4 px-4">AI grading & mentor</td>
              <td className="py-4 px-4 text-center">
                <X className="h-5 w-5 text-red-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-4 px-4">Financial match & autofill</td>
              <td className="py-4 px-4 text-center">
                <Clock className="h-5 w-5 text-yellow-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-4 px-4">Student dashboards</td>
              <td className="py-4 px-4 text-center">
                <X className="h-5 w-5 text-red-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex flex-col items-center">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-xs text-gray-400 mt-1">Up to 3</span>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex flex-col items-center">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-xs text-gray-400 mt-1">Unlimited</span>
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-4 px-4">Live chat or concierge</td>
              <td className="py-4 px-4 text-center">
                <X className="h-5 w-5 text-red-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <X className="h-5 w-5 text-red-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-4 px-4">Cancel anytime</td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
              <td className="py-4 px-4 text-center">
                <Check className="h-5 w-5 text-green-500 mx-auto" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Check className="h-4 w-4 text-green-500" /> Included
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-yellow-500" /> Limited
        </div>
        <div className="flex items-center gap-1">
          <X className="h-4 w-4 text-red-500" /> Not included
        </div>
      </div>
    </div>
  )
}
