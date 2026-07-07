

import React from 'react';
import Link from 'next/link';
import { Dumbbell } from 'lucide-react';
import { LoginForm } from '@/components/features/auth';
import { SuperAdminSetupForm } from '@/components/features/auth/super-admin-setup-form';


export const metadata = {
  title: 'Super Admin Setup - GymFlow',
  description: 'Initialize your GymFlow system with a super admin account',
};



export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br  from-background via-background to-secondary/20 flex items-center justify-center px- sm:px-4 py-12">
      {/* Background decorative elements */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20"></div>
      </div>


      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card container with gradient border effect */}
        <div className="relative group">
          {/* Gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20 rounded-2xl blur transition duration-1000"></div>

          {/* Main card */}
          <div className="relative bg-card backdrop-blur-xl border border-border/50 rounded-2xl p-8 md:p-10 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-lg my-1">
                  <Dumbbell className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary  to-accent bg-clip-text text-transparent mb-3">
                GymFlow
              </h1>
              <p className="text-xs text-muted-foreground text-center ">
                🔒 Your credentials are encrypted and secure. Never share your password.
              </p>
            </div>



            {/* Form */}
            <SuperAdminSetupForm />


            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="backdrop-blur-md   rounded-xl p-4 border border-orange-700">
                <div className="text-2xl mb-2">⚡</div>
                <p className="text-xs font-semibold text-foreground mb-1">One-time Setup</p>
                <p className="text-xs text-muted-foreground">Initialize once and manage everything</p>
              </div>
              <div className="backdrop-blur-md  border border-orange-700 rounded-xl p-4">
                <div className="text-2xl mb-2">🔐</div>
                <p className="text-xs font-semibold text-foreground mb-1">Secure Access</p>
                <p className="text-xs text-muted-foreground">Military-grade encryption for data</p>
              </div>
            </div>


          </div>
        </div>

      </div>


    </div>
  );
}
