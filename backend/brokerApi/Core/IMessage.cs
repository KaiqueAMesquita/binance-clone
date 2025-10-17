namespace Core
{
    public interface IMessage
    {
        Guid Id { get; }
        string RoutingKey { get; }
        byte[] Body { get; }
        int DeliveryCount { get; set; } // para retries, segundo o prof
        DateTime CreatedAt { get; }
    }
}