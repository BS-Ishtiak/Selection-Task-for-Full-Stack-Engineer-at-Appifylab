import Image from "next/image";

export default function Registration() {
  return (
    <section className="relative min-h-screen flex items-center bg-white font-sans">
      {/* Decorative shapes (absolute) */}
      <div className="absolute left-0 top-8 pointer-events-none">
        <Image src="/assets/images/shape1.svg" alt="shape1" width={220} height={220} />
      </div>

      <div className="absolute right-0 top-24 pointer-events-none">
        <Image src="/assets/images/shape2.svg" alt="shape2" width={200} height={200} />
      </div>

      <div className="absolute left-8 bottom-10 pointer-events-none">
        <Image src="/assets/images/shape3.svg" alt="shape3" width={180} height={180} />
      </div>

      <div className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left images */}
            <div className="lg:col-span-8 order-2 lg:order-1 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-lg">
                <div className="hidden lg:block">
                  <Image src="/assets/images/registration.png" alt="registration" width={640} height={520} />
                </div>
                <div className="block lg:hidden">
                  <Image src="/assets/images/registration1.png" alt="registration" width={480} height={400} />
                </div>
              </div>
            </div>

            {/* Right form */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="bg-white shadow-lg rounded-xl p-8 sm:p-10 max-w-md mx-auto">
                <div className="flex items-center mb-6">
                  <Image src="/assets/images/logo.svg" alt="Logo" width={56} height={40} />
                </div>
                <p className="text-sm text-gray-500 mb-2">Get Started Now</p>
                <h4 className="text-2xl font-semibold text-gray-900 mb-6">Registration</h4>

                <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 mb-4 hover:shadow-sm">
                  <Image src="/assets/images/google.svg" alt="google" width={20} height={20} />
                  <span className="text-sm">Register with google</span>
                </button>

                <div className="text-center text-gray-400 mb-4">Or</div>

                <form>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Email</label>
                      <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Password</label>
                      <input type="password" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Repeat Password</label>
                      <input type="password" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>
                    <div className="flex items-center">
                      <input id="agree" type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                      <label htmlFor="agree" className="ml-3 text-sm text-gray-700">I agree to terms &amp; conditions</label>
                    </div>
                    <div>
                      <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg py-3 hover:bg-indigo-700">Register now</button>
                    </div>
                  </div>
                </form>

                <p className="text-sm text-gray-500 text-center mt-6">Dont have an account? <a href="#" className="text-indigo-600">Create New Account</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
