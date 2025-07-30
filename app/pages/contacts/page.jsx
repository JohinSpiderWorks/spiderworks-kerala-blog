import React from "react";
import axios from "axios";
import parse from "html-react-parser";
import { BASE_URL } from "@/baseUrl/baseUrl";

export const dynamic = "force-dynamic"; // optional: disable static caching

export default async function ContactsPage() {
  let page;

  try {
    const res = await axios.get(`${BASE_URL}/blogs/pages/contacts`);
    page = res.data.data;
    console.log(page);
    
  } catch (err) {
    console.error("Failed to fetch contacts page:", err);
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load Contact Page
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold mb-4 text-center">{page.title}</h1>
      <div className="my-4">
      <hr />
    </div>
      
    {page.short_description && (
      <p className="text-gray-600 mb-4">{page.short_description}</p>
    )}
  
    {page.top_description && (
      <div className="mb-6">{parse(page.top_description)}</div>
    )}
  
    {page.page_sections?.map((section) => (
      <div key={section.id} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
        <div>{parse(section.content)}</div>
      </div>
    ))}
  
    {page.bottom_description && (
      <div className="mt-6 border-t pt-4">{parse(page.bottom_description)}</div>
    )}
  </div>
  );
}