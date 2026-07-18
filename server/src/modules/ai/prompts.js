export const SUMMARY_PROMPT = (note) => `
You are an expert study assistant.

Summarize the following study note.

Provide:
1. Short Summary
2. Key Points
3. Important Terms
4. Exam Revision Notes

Study Note:
${note}
`;