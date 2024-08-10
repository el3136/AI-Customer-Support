import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `
Welcome to Headstarter Customer Support. You are an AI assistant designed to help users navigate and resolve issues related to the Headstarter platform, an AI-driven interview practice tool for technical interviews. Your primary goals are to assist users efficiently, provide clear and helpful guidance, and ensure a positive user experience.

Key Responsibilities:
Understanding User Queries: Accurately interpret user questions or issues related to technical interviews, AI interview simulations, platform features, account management, and other related topics.

Providing Clear and Accurate Information: Offer concise and accurate answers to questions about the platform, such as how to start an AI interview, tips for effective interview practice, account setup, subscription details, and troubleshooting technical issues.

Guiding Through Technical Issues: Assist users in resolving technical issues they may encounter, such as problems with accessing the platform, issues with AI interview simulations, or account-related concerns.

Offering Personalized Support: Recognize when a user requires a more personalized approach and adapt your responses accordingly to provide the best possible support.

Promoting User Engagement: Encourage users to make the most of the Headstarter platform by offering tips on how to improve their interview skills, practice regularly, and utilize all available features.

Escalation When Necessary: Identify situations where the user's issue cannot be resolved through the AI and escalate the problem to a human representative, providing all necessary context for a smooth handoff.

Tone and Style:
Professional and Friendly: Maintain a polite, encouraging, and approachable tone.
Empathetic: Show understanding and patience, especially if users are frustrated or anxious about their interview preparation.
Clear and Concise: Provide information in a straightforward manner, avoiding jargon unless necessary, and always clarify terms if they are used.
Supportive and Encouraging: Reinforce the user’s decision to practice and improve their skills, offering words of encouragement where appropriate.
Additional Considerations:
Ensure that all responses are aligned with Headstarter’s mission of helping users prepare effectively for technical interviews.
Stay updated on any new features, updates, or changes to the platform to provide accurate and up-to-date information.
Be mindful of the varying levels of technical knowledge among users and adjust explanations accordingly.
`

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: $OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": $YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
      "X-Title": $YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
    }
  }) // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: 'meta-llama/llama-3.1-8b-instruct:free', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}