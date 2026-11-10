import { Injectable } from '@nestjs/common';
import { Kafka, KafkaConfig, Consumer } from 'kafkajs';

export interface KafkaEnvironmentConfig {
  clientId: string;
  brokers: string[];
  groupId: string;
  sessionTimeout: number;
  heartbeatInterval: number;
  rebalanceTimeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface KafkaConsumerOptions {
  groupId: string;
  sessionTimeout?: number;
  heartbeat?: {
    interval: number;
  };
  rebalanceTimeout?: number;
}

@Injectable()
export class KafkaConfigService {
  private readonly config: KafkaEnvironmentConfig;

  constructor() {
    const brokersEnv = process.env.KAFKA_BROKERS || 'localhost:9092';
    const brokers = brokersEnv.split(',').map(b => b.trim());

    this.config = {
      clientId: process.env.KAFKA_CLIENT_ID || 'order-events-api',
      brokers,
      groupId: process.env.KAFKA_GROUP_ID || 'order-events-consumer-group',
      sessionTimeout: parseInt(process.env.KAFKA_SESSION_TIMEOUT || '30000', 10),
      heartbeatInterval: parseInt(process.env.KAFKA_HEARTBEAT_INTERVAL || '3000', 10),
      rebalanceTimeout: parseInt(process.env.KAFKA_REBALANCE_TIMEOUT || '60000', 10),
      retryAttempts: parseInt(process.env.KAFKA_RETRY_ATTEMPTS || '5', 10),
      retryDelay: parseInt(process.env.KAFKA_RETRY_DELAY || '1000', 10),
    };
  }

  getKafkaConfig(): KafkaConfig {
    return {
      clientId: this.config.clientId,
      brokers: this.config.brokers,
      retry: {
        initialRetryTime: this.config.retryDelay,
        retries: this.config.retryAttempts,
      },
    };
  }

  getConsumerConfig(): KafkaConsumerOptions {
    return {
      groupId: this.config.groupId,
      sessionTimeout: this.config.sessionTimeout,
      heartbeat: {
        interval: this.config.heartbeatInterval,
      },
      rebalanceTimeout: this.config.rebalanceTimeout,
    };
  }

  getClientId(): string {
    return this.config.clientId;
  }

  getBrokers(): string[] {
    return this.config.brokers;
  }

  getGroupId(): string {
    return this.config.groupId;
  }

  validateConfig(): boolean {
    if (!this.config.clientId || this.config.clientId.trim() === '') {
      return false;
    }
    if (!this.config.brokers || this.config.brokers.length === 0) {
      return false;
    }
    if (!this.config.groupId || this.config.groupId.trim() === '') {
      return false;
    }
    return true;
  }

  createKafkaInstance(): Kafka {
    return new Kafka(this.getKafkaConfig());
  }

  createConsumer(kafka: Kafka): Consumer {
    return kafka.consumer(this.getConsumerConfig());
  }
}