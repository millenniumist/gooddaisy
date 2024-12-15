import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { icons, creteIcon } from "lucide-react";

export default function ContactPage() {
  const socialLinks = {
    instagram: {
      url: "https://www.instagram.com/gooddaisy.store",
      handle: "@gooddaisy.store"
    },
    line: {
      url: "https://line.me/R/ti/p/@gooddaisy?from=page&accountId=gooddaisy",
      handle: "@gooddaisy"
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Email: info@example.com</p>
            <p>Phone: +1 (123) 456-7890</p>
            <p>Address: 123 Main St, City, Country</p>
            <div className="flex">
              <div className="flex items-center space-x-2">
              <i data-lucide="instagram"></i>
                <a
                  href={socialLinks.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {socialLinks.instagram.handle}
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8">
                  <svg
                    fill="#000000"
                    viewBox="-5.5 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_iconCarrier">
                      <title>line</title>
                      <path d="M10.656 5.938c5.938 0 10.719 3.875 10.719 8.688 0 2.344-1.156 4.406-2.969 6.031-2.938 2.906-8 5.844-8.531 5.625-0.875-0.344 0.656-2.219 0.031-3.031-0.094-0.125-0.438-0.094-1.063-0.188-5.156-0.688-8.844-4.094-8.844-8.469 0-4.813 4.75-8.656 10.656-8.656zM4.563 17.5h1.813c0.313 0 0.5-0.25 0.5-0.563 0-0.219-0.156-0.5-0.563-0.5h-1.469c-0.125 0-0.125-0.125-0.125-0.563v-3.156c0-0.281-0.188-0.563-0.531-0.563-0.313 0-0.531 0.25-0.531 0.563v3.813c0 0.844 0.406 0.969 0.906 0.969zM8.656 17.063v-4.344c0-0.281-0.219-0.563-0.563-0.563-0.281 0-0.531 0.25-0.531 0.563v4.344c0 0.281 0.219 0.5 0.563 0.5 0.281 0 0.531-0.219 0.531-0.5zM13.781 16.469v-3.813c0-0.281-0.219-0.5-0.563-0.5-0.25 0-0.531 0.156-0.531 0.5v2.75l-1.813-2.531c-0.25-0.438-0.563-0.719-0.938-0.719-0.469 0-0.5 0.375-0.5 0.906v4c0 0.281 0.219 0.5 0.531 0.5 0.281 0 0.531-0.188 0.531-0.5v-2.844l1.813 2.531c0.406 0.531 0.5 0.813 1 0.813 0.344 0 0.469-0.313 0.469-1.094zM17.281 14.313h-1.594v-0.906c0-0.094 0.031-0.219 0.188-0.219h1.406c0.344 0 0.563-0.188 0.563-0.531 0-0.406-0.313-0.531-0.594-0.531h-1.813c-0.563 0-0.844 0.375-0.844 0.875v3.531c0 0.625 0.25 0.969 0.844 0.969h1.844c0.406 0 0.563-0.25 0.563-0.563 0-0.406-0.313-0.531-0.563-0.531h-1.375c-0.125 0-0.219-0.094-0.219-0.188v-0.875h1.656c0.406 0 0.469-0.313 0.469-0.531 0-0.313-0.25-0.5-0.531-0.5z"></path>
                    </g>
                  </svg>
                </div>
                <a
                  href={socialLinks.line.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {socialLinks.line.handle}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
