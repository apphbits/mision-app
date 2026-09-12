import 'package:flutter/material.dart';
import 'core/theme/mindful_sanctuary_theme.dart';

void main() {
  runApp(const MisionApp());
}

class MisionApp extends StatelessWidget {
  const MisionApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MISIÓN',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: MindfulColors.background,
        colorScheme: ColorScheme.fromSeed(
          seedColor: MindfulColors.primary,
          primary: MindfulColors.primary,
          surface: MindfulColors.surface,
        ),
        useMaterial3: true,
      ),
      home: const Scaffold(
        body: Center(
          child: Text(
            'MISIÓN — Santuario Personal',
            style: TextStyle(
              color: MindfulColors.textMain,
              fontWeight: FontWeight.bold,
              fontSize: 20,
            ),
          ),
        ),
      ),
    );
  }
}
