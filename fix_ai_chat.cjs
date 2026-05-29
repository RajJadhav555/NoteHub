const fs = require('fs');

const file = 'e:/Notehub/src/modules/Notes.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the fallback string with error handling
const target1 = `      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          text: data.reply || "Sorry, I couldn't process that.",
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Connection error. Please try again.",
          isUser: false,
        },
      ]);
    } finally {`;

const repl1 = `      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setMessages((prev) => [
        ...prev,
        {
          text: data.reply || "Sorry, I couldn't process that.",
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: error.message || "Connection error. Please try again.",
          isUser: false,
        },
      ]);
    } finally {`;

// Handle Ask AI button
const target2 = `              <button
                onClick={() => setShowAIModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium flex items-center space-x-2 shadow-sm"
              >`;

const repl2 = `              <button
                onClick={() => {
                  if (typeof isVisitor !== 'undefined' && isVisitor) {
                    alert("Please log in to use the Notes AI Assistant.");
                  } else {
                    setShowAIModal(true);
                  }
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium flex items-center space-x-2 shadow-sm"
              >`;

content = content.replace(target1, repl1);
content = content.replace(target2, repl2);

fs.writeFileSync(file, content);
console.log('Fixed Notes.tsx successfully');
