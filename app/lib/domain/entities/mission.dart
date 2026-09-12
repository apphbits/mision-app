class Mission {
  final String id;
  final String? goalId;
  final String title;
  final String description;
  final String category;
  final String difficulty;
  final int durationMinutes;
  final int impulsoReward;
  final int chispasReward;
  final bool isCompleted;
  final DateTime? completedAt;

  Mission({
    required this.id,
    this.goalId,
    required this.title,
    required this.description,
    required this.category,
    required this.difficulty,
    this.durationMinutes = 15,
    required this.impulsoReward,
    required this.chispasReward,
    this.isCompleted = false,
    this.completedAt,
  });

  factory Mission.fromJson(Map<String, dynamic> json) {
    return Mission(
      id: json['id'] ?? '',
      goalId: json['goal_id'],
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? 'Mente',
      difficulty: json['difficulty'] ?? 'Normal',
      durationMinutes: json['duration_minutes'] ?? 15,
      impulsoReward: json['impulso_reward'] ?? 25,
      chispasReward: json['chispas_reward'] ?? 10,
      isCompleted: json['is_completed'] ?? false,
      completedAt: json['completed_at'] != null ? DateTime.tryParse(json['completed_at']) : null,
    );
  }
}
