import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RLSSetupGuidePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Supabase Row Level Security (RLS) Setup Guide</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Understanding the Issue</CardTitle>
          <CardDescription>
            Row Level Security (RLS) is a Supabase feature that restricts which rows users can access in a database
            table.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            The error{" "}
            <code className="bg-gray-100 p-1 rounded">
              new row violates row-level security policy for table "parent_profile"
            </code>{" "}
            occurs because the current user doesn't have permission to insert data into the table.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Solution 1: Create an RLS Policy (Recommended)</CardTitle>
          <CardDescription>Create a policy that allows authenticated users to insert their own data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Go to your Supabase dashboard, select your project, and follow these steps:</p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Go to <strong>Authentication → Policies</strong>
            </li>
            <li>
              Find the <code>parent_profile</code> table
            </li>
            <li>
              Click <strong>New Policy</strong>
            </li>
            <li>
              Select <strong>Insert</strong> template
            </li>
            <li>
              For the policy definition, use something like:
              <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
                {`CREATE POLICY "Users can insert their own profile" 
ON parent_profile 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);`}
              </pre>
            </li>
            <li>
              Similarly, create a policy for the <code>student</code> table:
              <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
                {`CREATE POLICY "Users can insert their own students" 
ON student 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = parent_id);`}
              </pre>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Solution 2: Temporarily Disable RLS (Not Recommended for Production)</CardTitle>
          <CardDescription>For testing purposes only, you can temporarily disable RLS.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Go to your Supabase dashboard, select your project, and follow these steps:</p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Go to <strong>Table Editor</strong>
            </li>
            <li>
              Find the <code>parent_profile</code> table
            </li>
            <li>
              Click on <strong>RLS</strong> to toggle it off
            </li>
            <li>
              Do the same for the <code>student</code> table
            </li>
            <li>
              <strong>Important:</strong> Remember to re-enable RLS before deploying to production!
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Solution 3: Use Service Role Key (Advanced)</CardTitle>
          <CardDescription>
            For server-side operations, you can use a service role key that bypasses RLS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This approach requires additional setup:</p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to your Supabase dashboard → Project Settings → API</li>
            <li>
              Find the <strong>service_role</strong> key (keep this secret!)
            </li>
            <li>
              Add it to your environment variables as <code>SUPABASE_SERVICE_KEY</code>
            </li>
            <li>Use this key for server-side operations only</li>
            <li>
              <strong>Warning:</strong> Never expose this key to the client!
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
