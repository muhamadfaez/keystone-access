import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
export function ProfilePage() {
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Profile updates are not yet implemented.");
  };
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Password changes are not yet implemented.");
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <PageHeader
            title="User Profile"
            subtitle="Manage your account details and security settings."
          />
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
                    <AvatarFallback>AU</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">Admin User</h3>
                  <p className="text-sm text-muted-foreground">admin@university.edu</p>
                  <p className="text-xs text-muted-foreground mt-1">System Administrator</p>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 space-y-8">
              <Card>
                <form onSubmit={handleUpdate}>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      This information is read-only for this demo.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value="Admin User" readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value="admin@university.edu" readOnly />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" value="IT Services" readOnly />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Update Profile</Button>
                  </CardFooter>
                </form>
              </Card>
              <Card>
                <form onSubmit={handlePasswordChange}>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Change your password here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" placeholder="••••••••" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Change Password</Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}