// controllers/textController.js
const Text = require("../models/texts");
const verbMap = require("../utils/verbMap");
const lemmatizer = require("wink-lemmatizer");

exports.analyzeUserText = async (req, res) => {
  try {
    const { userId, title, text } = req.body;

    // تنظيف النص وتقسيمه إلى كلمات
    const words = text
      .toLowerCase()
      .replace(/[^\p{L}\s]/gu, "") // إزالة علامات الترقيم
      .split(/\s+/);

    // تطبيع الكلمات (lemmatize + verbMap)
    const normalizedWords = words.map(
      (word) => verbMap[word] || lemmatizer.de.lemmatize(word),
    );

    // إزالة التكرار
    const uniqueWords = [...new Set(normalizedWords)];

    // حفظ النص في الـ DB
    const newText = await Text.create({
      user: userId,
      title,
      text,
      wordsTotal: normalizedWords.length.toString(),
      withoutRepetition: uniqueWords.length.toString(),
    });

    res.json({
      msg: "Text analyzed and saved",
      wordsTotal: normalizedWords.length,
      withoutRepetition: uniqueWords.length,
      normalizedWords,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
