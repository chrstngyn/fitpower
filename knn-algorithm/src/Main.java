import java.io.IOException;
import java.util.Scanner;

public class Main {

  public static void main(String[] args) throws NumberFormatException, IOException {

    System.out.println("KNN Algorithm Program");
    Scanner sc = new Scanner(System.in);
    KNN analyzeDataset = new KNN();
//    System.out.println("Enter training dataset file name");
//    String trainfilename = sc.nextLine();
//    System.out.println("Enter test dataset file name");
//    String testfilename = sc.nextLine();

    // get K value and distance metrics here

    analyzeDataset.loadtrainData(trainfilename);
    analyzeDataset.loadtestData(testfilename);
    analyzeDataset.loadtrainData("knn_train.txt");
    analyzeDataset.loadtestData("knn_test.txt");

    // calculate distance here.

    sc.close();


  }
}
