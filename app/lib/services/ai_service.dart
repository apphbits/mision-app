import 'dart:convert';
import 'package:http/http.dart' as http;

class GeneratedGoalPlan {
  final String? id;
  final String title;
  final String description;
  final String category;
  final int targetWeeks;
  final String icon;
  final String color;
  final List<RoadmapStage> roadmap;
  final List<GeneratedMissionItem> firstMissions;

  const GeneratedGoalPlan({
    this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.targetWeeks,
    required this.icon,
    required this.color,
    required this.roadmap,
    required this.firstMissions,
  });

  factory GeneratedGoalPlan.fromJson(Map<String, dynamic> json) {
    final goal = json['goal'] as Map<String, dynamic>? ?? {};
    final roadmapList = (json['roadmap'] as List<dynamic>?)
            ?.map((e) => RoadmapStage.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];
    final missionsList = (json['first_missions'] as List<dynamic>?)
            ?.map((e) => GeneratedMissionItem.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];

    return GeneratedGoalPlan(
      id: goal['id'] as String?,
      title: goal['title'] as String? ?? 'Meta',
      description: goal['description'] as String? ?? '',
      category: goal['category'] as String? ?? 'Crecimiento',
      targetWeeks: goal['target_weeks'] as int? ?? 12,
      icon: goal['icon'] as String? ?? 'flag',
      color: goal['color'] as String? ?? '#3A7D63',
      roadmap: roadmapList,
      firstMissions: missionsList,
    );
  }
}

class RoadmapStage {
  final int stage;
  final String title;

  const RoadmapStage({required this.stage, required this.title});

  factory RoadmapStage.fromJson(Map<String, dynamic> json) {
    return RoadmapStage(
      stage: json['stage'] as int? ?? 1,
      title: json['title'] as String? ?? '',
    );
  }
}

class GeneratedMissionItem {
  final String? id;
  final String title;
  final String description;
  final String difficulty;
  final int durationMinutes;
  final int impulsoReward;
  final int chispasReward;

  const GeneratedMissionItem({
    this.id,
    required this.title,
    required this.description,
    required this.difficulty,
    required this.durationMinutes,
    required this.impulsoReward,
    required this.chispasReward,
  });

  factory GeneratedMissionItem.fromJson(Map<String, dynamic> json) {
    return GeneratedMissionItem(
      id: json['id'] as String?,
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      difficulty: json['difficulty'] as String? ?? 'Fácil',
      durationMinutes: json['duration_minutes'] as int? ?? 10,
      impulsoReward: json['impulso_reward'] as int? ?? 10,
      chispasReward: json['chispas_reward'] as int? ?? 5,
    );
  }
}

class AIService {
  static const String supabaseUrl = 'https://bxgdaqcnphulhfchfqnf.supabase.co';
  static const String anonKey = 'sb_publishable_IExyjYiifrQe-_pWU5qgpw_HqZnZNhm';

  static Future<GeneratedGoalPlan?> generateGoalPlan({
    required String dream,
    int dailyMinutes = 10,
    String? meaning,
    String? currentLevel,
    String? authToken,
  }) async {
    final uri = Uri.parse('$supabaseUrl/functions/v1/ai-goal-planner');
    final headers = {
      'Content-Type': 'application/json',
      'apikey': anonKey,
      if (authToken != null) 'Authorization': 'Bearer $authToken',
    };

    final body = jsonEncode({
      'dream': dream,
      'daily_minutes': dailyMinutes,
      'meaning': meaning,
      'current_level': currentLevel,
    });

    try {
      final response = await http.post(uri, headers: headers, body: body);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return GeneratedGoalPlan.fromJson(data);
      } else {
        print('AI Goal Planner error: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Network exception calling AI Goal Planner: $e');
      return null;
    }
  }
}
