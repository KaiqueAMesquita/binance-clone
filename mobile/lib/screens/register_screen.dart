import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'home_screen.dart';

class RegisterScreen extends StatefulWidget {
  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;

  void _handleRegister() async {
    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('As senhas não conferem.')));
      return;
    }

    setState(() { _isLoading = true; });

    // Simulação de registro (pode conectar na API depois)
    await Future.delayed(Duration(seconds: 1)); // Mock delay
    
    // Aqui você chamaria _authService.register(...)
    bool success = true; 

    if (!mounted) return;
    setState(() { _isLoading = false; });

    if (success) {
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => HomeScreen()));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        title: Text("Criar Conta", style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.black,
        iconTheme: IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            Icon(Icons.person_add, size: 60, color: Colors.yellow[700]),
            SizedBox(height: 30),
            _buildTextField("Nome Completo", _nameController, false),
            SizedBox(height: 20),
            _buildTextField("E-mail", _emailController, false),
            SizedBox(height: 20),
            _buildTextField("Senha", _passwordController, true),
            SizedBox(height: 20),
            _buildTextField("Confirmar Senha", _confirmPasswordController, true),
            SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: _isLoading 
                ? Center(child: CircularProgressIndicator(color: Colors.yellow))
                : ElevatedButton(
                    onPressed: _handleRegister,
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.yellow[700]),
                    child: Text("Cadastrar", style: TextStyle(color: Colors.black, fontSize: 18)),
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, bool isObscure) {
    return TextField(
      controller: controller,
      obscureText: isObscure,
      style: TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.grey),
        enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.grey)),
        focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.yellow)),
      ),
    );
  }
}