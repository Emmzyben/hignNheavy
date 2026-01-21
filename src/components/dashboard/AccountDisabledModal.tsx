import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ban, MessageSquare, LogOut } from "lucide-react";
import SupportChat from "./SupportChat";
import { useAuth } from "@/contexts/AuthContext";

interface AccountDisabledModalProps {
    open: boolean;
}

const AccountDisabledModal = ({ open }: AccountDisabledModalProps) => {
    const { logout } = useAuth();
    const [showChat, setShowChat] = useState(false);

    const handleLogout = () => {
        logout();
        window.location.href = '/signin';
    };

    return (
        <>
            {!showChat ? (
                <Dialog open={open} onOpenChange={() => { }}>
                    <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl" hideCloseButton>
                        <DialogHeader className="text-center sm:text-center items-center justify-center flex flex-col space-y-4">
                            <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
                                <Ban size={32} className="text-destructive" />
                            </div>
                            <DialogTitle className="text-2xl font-black text-destructive">Account Disabled</DialogTitle>
                            <DialogDescription className="text-center text-base">
                                Your account has been deactivated by the administration. You can no longer access the dashboard or perform actions.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="bg-muted/30 p-4 rounded-lg border text-sm text-center text-muted-foreground my-4">
                            If you believe this is a mistake, please contact our support team immediately to resolve this issue.
                        </div>

                        <DialogFooter className="flex-col sm:flex-col gap-3 sm:space-x-0">
                            <Button
                                className="w-full gap-2"
                                size="lg"
                                onClick={() => setShowChat(true)}
                            >
                                <MessageSquare size={18} /> Chat with Support
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full gap-2 text-muted-foreground hover:text-destructive"
                                size="lg"
                                onClick={handleLogout}
                            >
                                <LogOut size={18} /> Sign Out
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <div className="fixed inset-0 z-50 bg-background flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 text-lg">
                            <MessageSquare size={20} className="text-primary" />
                            Support Chat
                        </h3>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                                Back
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                <LogOut size={16} className="mr-1" /> Sign Out
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <SupportChat />
                    </div>
                </div>
            )}
        </>
    );
};

export default AccountDisabledModal;
