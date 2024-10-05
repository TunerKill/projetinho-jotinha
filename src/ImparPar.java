import java.util.Scanner;

public class ImparPar {
    public static void main(String[] args) {
        Scanner ler = new Scanner(System.in);
        System.out.print("Escreva um número: ");

        int numero = ler.nextInt();

        if (numero % 2 == 0) {System.out.println("O número " + numero + " é par.");
        } else {
            System.out.println("O número " + numero + " é impar.");
        }

        ler.close();
    }
}
