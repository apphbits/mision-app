class ProgressionRank {
  final int level;
  final String title;
  final int minImpulso;
  final int maxImpulso;
  final String icon;

  const ProgressionRank({
    required this.level,
    required this.title,
    required this.minImpulso,
    required this.maxImpulso,
    required this.icon,
  });
}

class ProgressionService {
  static const List<ProgressionRank> ranks = [
    ProgressionRank(level: 1, title: 'Iniciado', minImpulso: 0, maxImpulso: 100, icon: 'spa'),
    ProgressionRank(level: 2, title: 'Explorador', minImpulso: 100, maxImpulso: 300, icon: 'explore'),
    ProgressionRank(level: 3, title: 'Practicante', minImpulso: 300, maxImpulso: 600, icon: 'self_improvement'),
    ProgressionRank(level: 4, title: 'Constructor', minImpulso: 600, maxImpulso: 1000, icon: 'military_tech'),
    ProgressionRank(level: 5, title: 'Forjador Constante', minImpulso: 1000, maxImpulso: 1500, icon: 'auto_awesome'),
    ProgressionRank(level: 6, title: 'Guardián del Ritmo', minImpulso: 1500, maxImpulso: 2200, icon: 'shield'),
    ProgressionRank(level: 7, title: 'Maestro de Hábitos', minImpulso: 2200, maxImpulso: 3000, icon: 'emoji_events'),
    ProgressionRank(level: 8, title: 'Arquitecto Vital', minImpulso: 3000, maxImpulso: 4000, icon: 'workspace_premium'),
  ];

  static ProgressionRank getRankForImpulso(int totalImpulso) {
    for (final rank in ranks) {
      if (totalImpulso >= rank.minImpulso && totalImpulso < rank.maxImpulso) {
        return rank;
      }
    }
    return ranks.last;
  }

  static double getProgressPercentage(int totalImpulso) {
    final rank = getRankForImpulso(totalImpulso);
    final inLevel = totalImpulso - rank.minImpulso;
    final needed = rank.maxImpulso - rank.minImpulso;
    return (inLevel / needed).clamp(0.0, 1.0);
  }
}
