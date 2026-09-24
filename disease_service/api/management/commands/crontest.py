from django.core.management.base import BaseCommand, CommandError
import random
import string


class Command(BaseCommand):
    def __masked__handle(self, *args, **options):
        print("Running MANAGEMENT test command...")
        #self.stdout.write(self.style.SUCCESS("MANAGEMENT Test command executed successfully."))

    def __masked__handle(self, *args, **options):
        print("Running create_gene_cronjob...")
        from api.models import Gene

        # Create a new gene entry
        symbol = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        name = f"{symbol}_GENE"
        gene = Gene(symbol=symbol, description=name)
        gene.save()
        print(f"Created new gene: {gene.symbol}")
        self.stdout.write(self.style.SUCCESS(f"Created new gene: {gene.symbol}"))

    def handle(self, *args, **options):
        print("Running API call test...")
        import requests

        url = "http://localhost:8000/api/genes/"
        try:
            response = requests.get(url)
            if response.status_code == 200:
                print("API call successful. Response:")
                print(response.json())
            else:
                print(f"API call failed with status code: {response.status_code}")
        except Exception as e:
            print(f"Error during API call: {e}")