import { Router } from 'express';
import { loadConfig, getConfigPath } from '@skillscan/core';
import { SkillScanner, findDuplicates } from '@skillscan/scanner';

const router = Router();

/**
 * GET /api/config - Get current configuration
 */
router.get('/config', async (_req, res, next) => {
  try {
    const config = loadConfig();
    const configPath = getConfigPath();

    res.json({
      config,
      configPath,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/duplicates - Get duplicate groups
 */
router.get('/duplicates', async (_req, res, next) => {
  try {
    const scanner = new SkillScanner();
    const result = await scanner.scan();
    const groups = findDuplicates(result.skills);

    res.json({
      groups,
      total: groups.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
