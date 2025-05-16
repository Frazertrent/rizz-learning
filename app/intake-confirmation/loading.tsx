export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Finalizing Your Personalized Plan...</h2>
        <div className="animate-spin h-12 w-12 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
        <p className="mt-4 text-gray-500">Just a moment while we put everything together!</p>
      </div>
    </div>
  )
}
