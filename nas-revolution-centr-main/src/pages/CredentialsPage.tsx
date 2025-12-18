import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LockKey } from "@phosphor-icons/react"

interface CredentialsPageProps {
  onBack: () => void
}

export default function CredentialsPage({ onBack }: CredentialsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2" />
          Back to Home
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 gradient-text">
            Credentials
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your login credentials
          </p>
        </div>

        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <LockKey weight="bold" className="text-primary" size={24} />
              </div>
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Demo credentials have been removed
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              All users must now be added through the admin panel.
            </p>
            <p className="text-sm text-muted-foreground">
              Students, teachers, and administrators will receive their login credentials when their accounts are created by the admin.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
