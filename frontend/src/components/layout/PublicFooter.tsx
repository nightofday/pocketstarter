'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Twitter, Github, Linkedin } from 'lucide-react'

import { useTheme } from '@/contexts/ThemeContext'

export default function PublicFooter() {
  const { theme } = useTheme()
  
  return (
    <footer className="bg-default border-t-1 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <Image 
                  src={theme === 'dark' ? '/logo-light.svg' : '/logo.svg'} 
                  alt="PocketStarter" 
                  width={120}
                  height={32}
                  className="h-8"
                />
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs font-medium">
              You can customize this text to summarize your product in 1-2 sentences.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Title 1
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                  Link 1
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                  Link 2
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                  Link 3
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Title 2
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                  Link 1
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                  Link 2
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                  Link 3
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Title 3
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                  Link 1
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                  Link 2
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                  Link 3
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t-1 border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PocketStarter. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              {/* Social Links - You can add your actual social media links here */}
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 