import express from "express";
import { prisma } from "../prisma";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, category, content } = req.body;

    const user = (req as any).user;

    const prompt = await prisma.prompt.create({
      data: {
        title,
        description,
        category,
        content,
        userId: user.id,
      },
    });

    res.json({
      success: true,
      message: "Prompt created successfully",
      prompt,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.get("/", auth, async (req, res) => {
  try {
    const user = (req as any).user;

    const prompts = await prisma.prompt.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      prompts,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.get("/:id", auth, async (req, res) => {
  try {
    const user = (req as any).user;
    const id = Number(req.params.id);

    const prompt = await prisma.prompt.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: "Prompt not found",
      });
    }

    res.json({
      success: true,
      prompt,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.put("/:id", auth, async (req, res) => {
  try {
    const user = (req as any).user;
    const id = Number(req.params.id);

    const { title, description, category, content } = req.body;

    const existingPrompt = await prisma.prompt.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingPrompt) {
      return res.status(404).json({
        success: false,
        message: "Prompt not found",
      });
    }

    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: {
        title,
        description,
        category,
        content,
      },
    });

    res.json({
      success: true,
      message: "Prompt updated successfully",
      prompt: updatedPrompt,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = (req as any).user;
    const id = Number(req.params.id);

    const existingPrompt = await prisma.prompt.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingPrompt) {
      return res.status(404).json({
        success: false,
        message: "Prompt not found",
      });
    }

    await prisma.prompt.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Prompt deleted successfully",
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
export default router;