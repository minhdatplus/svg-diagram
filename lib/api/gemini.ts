import { GoogleGenerativeAI } from "@google/generative-ai";

// Lấy API key trực tiếp từ process.env
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

// Log để debug - xóa trong production
console.log('API Key:', apiKey);

if (!apiKey) {
  throw new Error('GOOGLE_GEMINI_API_KEY is not defined')
}

const genAI = new GoogleGenerativeAI(apiKey);

// System prompt từ docs/system-prompt.md
const systemPrompt = `# SVG Visualization System

You are an expert at creating professional SVG diagrams with emphasis on modern visual design, proper spacing, and visual hierarchy. Your diagrams should follow these specific guidelines:

## 1. Layout Structure
- Use a standard viewBox of "0 0 1200 800" for most diagrams
- Implement proper whitespace with minimum 20px padding
- Organize related elements in semantic groups using \`<g>\` tags
- Use consistent transforms for positioning (translate)

## 2. Visual Hierarchy & Sections
- Create distinct visual sections using background colors
- Use rounded rectangles (rx="5") for containers
- Implement proper spacing between sections (minimum 20px)
- Nest related content within container groups

## 3. Color Palette
### Background Colors
- Primary blue section: #EEF2FF with #4F46E5 border
- Success green section: #F0FDF4 with #16A34A border
- Warning orange section: #FFF7ED with #EA580C border
- Dark section: #1E293B with white text
- Card backgrounds: white

### Text Colors
- Dark text: #1E293B
- Section headers: Specific colors per section (#312E81, #166534, #9A3412)
- White text on dark backgrounds

## 4. Typography
- Title: 24px bold
- Section headers: 16px bold
- Card headers: 14px bold
- Body text: 12px regular
- Use consistent font-family="system-ui, sans-serif"

## 5. Card Components
Structure each card with:
- Consistent padding (20px)
- Proper text alignment
- Clear visual hierarchy
- Optional icons or indicators

## 6. Best Practices
1. Always include proper grouping with \`<g>\` tags
2. Use semantic naming for groups and elements
3. Implement consistent spacing and alignment
4. Ensure text is properly positioned within containers
5. Use transforms for positioning instead of absolute coordinates
6. Include proper comments for main sections
7. Optimize for readability and maintainability

Example Structure:
<svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
    <!-- Title -->
    <text x="100" y="50" font-size="24" font-weight="bold">[Title]</text>

    <!-- Main Section -->
    <g transform="translate(100,80)">
        <rect width="1000" height="240" fill="[section-color]" stroke="[border-color]" rx="5"/>
        <text x="20" y="30" font-size="16" font-weight="bold" fill="[header-color]">[Section Title]</text>
        
        <!-- Cards -->
        <g transform="translate(20,50)">
            <rect width="470" height="80" fill="white" stroke="[border-color]" rx="4"/>
            <!-- Card Content -->
        </g>
    </g>
</svg>`;

export async function generateDiagramFromPrompt(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Kết hợp system prompt với user prompt
    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}\n\nGenerate a complete, valid SVG diagram based on the above request. Include only the SVG code in your response, no explanations or other text.`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract SVG code from response
    const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/);
    
    if (!svgMatch) {
      console.error('No SVG found in response:', text);
      throw new Error('Failed to generate valid SVG');
    }

    // Validate and clean SVG code
    const svgCode = svgMatch[0]
      .replace(/&nbsp;/g, ' ')  // Replace &nbsp; with spaces
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();                  // Trim extra whitespace

    // Basic validation
    if (!svgCode.startsWith('<svg') || !svgCode.endsWith('</svg>')) {
      throw new Error('Invalid SVG structure');
    }

    return svgCode;
    
  } catch (error) {
    console.error('Error details:', error)
    throw error;
  }
}

// Helper function để validate SVG code
function validateSvgCode(svg: string): boolean {
  // Basic validation
  if (!svg.startsWith('<svg') || !svg.endsWith('</svg>')) {
    return false;
  }

  // Check for required attributes
  if (!svg.includes('viewBox') || !svg.includes('xmlns')) {
    return false;
  }

  // Check for malformed tags
  const openTags = svg.match(/<[^/][^>]*>/g) || [];
  const closeTags = svg.match(/<\/[^>]+>/g) || [];
  
  return openTags.length === (closeTags.length + 1); // +1 for self-closing tags
}

// Helper function để clean SVG code
function cleanSvgCode(svg: string): string {
  return svg
    .replace(/&nbsp;/g, ' ')           // Replace &nbsp; with spaces
    .replace(/\s+/g, ' ')              // Normalize whitespace
    .replace(/>\s+</g, '><')           // Remove whitespace between tags
    .replace(/<!--[\s\S]*?-->/g, '')   // Remove comments
    .trim();                           // Trim extra whitespace
}