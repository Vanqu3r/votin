from google import genai

categoria = "Economía y Empleo"
propuesta = ("El gobierno priorizará la automatización total de procesos industriales sin establecer medidas compensatorias para el empleo, mantendrá la actual carga fiscal para todas las empresas y no considerará ajustes en el salario mínimo en el corto plazo.")

prompt = f"""
Evalúa la siguiente propuesta política y responde solo con los números (separados por comas) de las calificaciones del 1 al 5, según corresponda a cada pregunta. No agregues texto adicional, solo los números en el orden de las preguntas.

Categoría de la propuesta:
{categoria}

Propuesta:
{propuesta}

Preguntas:
1. ¿Está de acuerdo con la implementación de políticas que incentiven la creación de nuevos empleos en el país?
2. ¿Cree que es necesario reducir impuestos para apoyar a las pequeñas y medianas empresas?
3. ¿Apoya el aumento del salario mínimo para mejorar la calidad de vida de los trabajadores?

Devuelve la respuesta en el formato:
número,número,número (por ejemplo: 5,4,3)
"""

client = genai.Client(api_key="AIzaSyAns4IRZ6vdnfK8dqWQv_jKoy1_ZT8jUIo")
response = client.models.generate_content(
    model='gemini-2.0-flash',
    contents=prompt,
)

# Solo imprime los números
print(response.text)
