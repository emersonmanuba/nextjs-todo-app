import toast from "react-hot-toast";

export const toastSuccess = (message: string) => {
  toast.success(message);
}


export const toastError = (message: string) => {
    toast.error(message);
}

export const toastLoading = (message: string) => {
    return toast.loading(message);
}


export const toastMessages = {
    //Auth
    signupSuccess: "Account created successfully! Please check your email to verify.",
    loginSuccess: "Welcome back!",
    logoutSuccess: "Logged out successfully",
    passwordChangeSuccess: "Password changed successfully",
    passwordResetSent: "Password reset email sent! Check your inbox.",
    
    // Tasks
    taskCreated: "Task created successfully",
    taskUpdated: "Task updated successfully",
    taskDeleted: "Task deleted successfully",
    taskStarted: "Task marked as in progress",
    taskCompleted: "Task completed! 🎉",
    
    // Profile
    profileUpdated: "Profile updated successfully",
    
    // Errors
    authError: "Authentication failed. Please try again.",
    networkError: "Network error. Please check your connection.",
    genericError: "Something went wrong. Please try again.",
};