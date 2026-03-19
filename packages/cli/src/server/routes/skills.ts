import { Router } from 'express';
import { SkillScanner, findDuplicates } from '@skillscan/scanner';
import type { SkillScope } from '@skillscan/core';

const router = Router();
const scanner = new SkillScanner();

/**
 * GET /api/skills - List skills
 * Query params: client, scope, search, deduplicate
 */
router.get('/skills', async (req, res, next) => {
  try {
    const { client, scope, search, deduplicate } = req.query;

    // Scan all skills
    const result = await scanner.scan();
    let skills = result.skills;

    // Apply filters
    if (client && typeof client === 'string') {
      skills = skills.filter(skill =>
        skill.client.toLowerCase() === client.toLowerCase()
      );
    }

    if (scope && typeof scope === 'string') {
      const normalizedScope = scope.toLowerCase() as SkillScope;
      skills = skills.filter(skill => skill.scope === normalizedScope);
    }

    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      skills = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchLower)
      );
    }

    // Deduplicate if requested
    if (deduplicate === 'true') {
      const duplicateGroups = findDuplicates(skills);
      const canonicalIds = new Set(duplicateGroups.map(group => group.canonical.id));

      // Get all skills that are not duplicates, plus canonical instances
      const duplicateSkillIds = new Set(
        duplicateGroups.flatMap(group => group.skills.map(s => s.id))
      );

      skills = skills.filter(skill =>
        !duplicateSkillIds.has(skill.id) || canonicalIds.has(skill.id)
      );
    }

    res.json({
      skills,
      total: skills.length,
      scannedAt: result.scannedAt,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/skills/:id - Get skill detail
 */
router.get('/skills/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const skillDetail = await scanner.inspect(id);

    if (!skillDetail) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }

    res.json(skillDetail);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/skills/:id - Delete skill
 */
router.delete('/skills/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await scanner.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
