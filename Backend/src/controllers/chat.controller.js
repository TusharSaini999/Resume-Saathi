import mongoose from 'mongoose';
import ResumesCollection from '../models/resumes_collection.model.js';
import ChatMessage from '../models/chatMessage.model.js';
import ChatSession from '../models/chatSession.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import Chat from '../chat/chat.js';

const chat = asyncHandler(async (req, res) => {
  const user = req.user;
  const query = req.body.query;
  const chatId = req.body?.chatId;
  if (!query) {
    throw new ApiError(400, 'Query is required');
  }
  //Get the Resume Text
  const resume = await ResumesCollection.findById(user.resume_id);
  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }
  if (chatId && mongoose.Types.ObjectId.isValid(chatId)) {
    const chatSession = await ChatSession.findOne({ _id: chatId, user_id: user._id });
    if (!chatSession) {
      throw new ApiError(404, 'Chat session not found');
    }
    const chatMessages = await ChatMessage.find({ session_id: chatSession._id }).sort({
      createdAt: 1,
    });
    const formattedMessages = chatMessages.map((msg) => ({
      sender: msg.sender,
      message: msg.message,
    }));
    const chatInstance = new Chat();
    const response = await chatInstance.chat(
      query,
      user._id.toString(),
      user.name,
      user.resume_id.toString(),
      resume.parsed_data,
      formattedMessages
    );
    delete response.title;
    const newChatMessage = await ChatMessage.create({
      user_id: user._id,
      session_id: chatSession._id,
      sender: 'user',
      message: query,
    });
    const aiChatMessage = await ChatMessage.create({
      user_id: user._id,
      session_id: chatSession._id,
      sender: 'assistant',
      message: response.answer,
    });
    if (!newChatMessage || !aiChatMessage) {
      throw new ApiError(500, 'Failed to save chat messages');
    }
    return res.status(200).json(
      new ApiResponse(true, 200, 'Chat response generated', {
        message: aiChatMessage,
        chatSession: chatSession,
        newChat: false,
      })
    );
  } else {
    const chatSession = new Chat();
    const response = await chatSession.chat(
      query,
      user._id.toString(),
      user.name,
      user.resume_id.toString(),
      resume.parsed_data,
      []
    );
    if (!response) {
      throw new ApiError(502, 'AI response generation failed');
    }
    const newChatSession = await ChatSession.create({
      user_id: user._id,
      session_title: response.title || 'New Chat Session',
    });
    let aiChatMessage = null;
    if (newChatSession) {
      const newChatMessage = await ChatMessage.create({
        user_id: user._id,
        session_id: newChatSession._id,
        sender: 'user',
        message: query,
      });
      aiChatMessage = await ChatMessage.create({
        user_id: user._id,
        session_id: newChatSession._id,
        sender: 'assistant',
        message: response.answer,
      });
      if (!newChatMessage || !aiChatMessage) {
        throw new ApiError(500, 'Failed to save chat messages');
      }
    }
    return res.status(200).json(
      new ApiResponse(true, 200, 'Chat response generated', {
        message: aiChatMessage,
        chatSession: newChatSession,
        newChat: true,
      })
    );
  }
});

const history = asyncHandler(async (req, res) => {
  const user = req.user;
  const historyId = req.params?.id;
  if (historyId) {
    if (!mongoose.Types.ObjectId.isValid(historyId)) {
      throw new ApiError(400, 'Invalid history ID');
    }
    const chatSession = await ChatMessage.find({
      session_id: historyId,
      user_id: user._id,
    }).sort({ createdAt: 1 });
    if (!chatSession) {
      throw new ApiError(404, 'Chat history not found');
    }
    return res.status(200).json(new ApiResponse(true, 200, 'Chat history retrieved', chatSession));
  } else {
    const chatSessions = await ChatSession.find({ user_id: user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(true, 200, 'Chat history retrieved', chatSessions));
  }
});

const clearHistory = asyncHandler(async (req, res) => {
  const user = req.user;
  const historyId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(historyId)) {
    throw new ApiError(400, 'Invalid history ID');
  }
  const chatSession = await ChatSession.findOneAndDelete({
    _id: historyId,
    user_id: user._id,
  });
  if (!chatSession) {
    throw new ApiError(404, 'Chat history not found');
  }
  await ChatMessage.deleteMany({ session_id: historyId });
  return res.status(200).json(new ApiResponse(true, 200, 'Chat history cleared',historyId));
});

export { chat, history, clearHistory };
