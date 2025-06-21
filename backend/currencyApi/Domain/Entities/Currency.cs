public class Currency
{
    public int Id { get; set; }
    public string Symbol { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Backing { get; set; }
    public bool Reverse { get; set; } = false;
    
    public ICollection<History> Histories { get; set; }
}