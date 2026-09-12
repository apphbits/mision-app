class Goal {
  final String id;
  final String userId;
  final String title;
  final String description;
  final String category;
  final DateTime? targetDate;
  final String status;
  final double progress;
  final String icon;
  final String color;
  final int totalMissionsTarget;
  final int completedMissionsCount;

  Goal({
    required this.id,
    required this.userId,
    required this.title,
    required this.description,
    required this.category,
    this.targetDate,
    this.status = 'active',
    this.progress = 0.0,
    this.icon = 'flag',
    this.color = '#3A7D63',
    this.totalMissionsTarget = 20,
    this.completedMissionsCount = 0,
  });

  factory Goal.fromJson(Map<String, dynamic> json) {
    return Goal(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? 'Crecimiento',
      targetDate: json['target_date'] != null ? DateTime.tryParse(json['target_date']) : null,
      status: json['status'] ?? 'active',
      progress: (json['progress'] as num?)?.toDouble() ?? 0.0,
      icon: json['icon'] ?? 'flag',
      color: json['color'] ?? '#3A7D63',
      totalMissionsTarget: json['total_missions_target'] ?? 20,
      completedMissionsCount: json['completed_missions_count'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'user_id': userId,
    'title': title,
    'description': description,
    'category': category,
    'target_date': targetDate?.toIso8601String(),
    'status': status,
    'progress': progress,
    'icon': icon,
    'color': color,
  };
}
